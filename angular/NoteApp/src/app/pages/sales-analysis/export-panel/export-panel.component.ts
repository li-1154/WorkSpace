import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { DispatchService } from 'src/app/services/dispatch.service';

@Component({
  selector: 'app-export-panel',
  templateUrl: './export-panel.component.html',
  styleUrls: ['./export-panel.component.css'],
})
export class ExportPanelComponent implements OnInit {
  loading = false;

  productMap: Record<string, any> = {};
  dispatchMap: Record<string, string> = {};
  cachedHistory: any[] | null = null; // ⭐ 缓存全部 stockHistory

  startDate = '';
  endDate = '';
  targetDays: number;

  constructor(private afs: AngularFirestore, private dispatchService: DispatchService) { }

  async ngOnInit() {
    await this.loadProducts();
    await this.loadDispatch();

    const today = this.formatToday();
    this.startDate = today;
    this.endDate = today;
  }

  // =============================
  //   一次性读取产品
  // =============================
  private async loadProducts() {
    const snap = await this.afs.collection('products').get().toPromise();
    snap?.forEach(doc => this.productMap[doc.id] = doc.data());
  }

  // =============================
  //   一次性读取仓库
  // =============================
  private async loadDispatch() {
    const snap = await this.afs.collection('dispatch').get().toPromise();
    snap?.forEach(doc => {
      const d: any = doc.data();
      this.dispatchMap[doc.id] = d.name || doc.id;
    });
  }

  // =============================
  //   按需读取 stockHistory（新）
  // =============================
  private cachedKey = '';

  private async loadStockHistoryIfNeeded() {
    const key = `${this.startDate}_${this.endDate}`;

    if (this.cachedHistory && this.cachedKey === key) {
      return;
    }

    console.log('⏳ 加载 stockHistory:', key);

    const snap = await this.afs.collectionGroup('stockHistory', ref =>
      ref.where('date', '>=', new Date(this.startDate))
        .where('date', '<=', new Date(this.endDate))
    ).get().toPromise();

    this.cachedHistory = snap?.docs || [];
    this.cachedKey = key;

    console.log('✔ 加载完成:', this.cachedHistory.length);
  }

  // =============================
  //         导出入口
  // =============================
  async export(type: string) {

    // ⭐ 在这里按需加载（最关键的改动）
    await this.loadStockHistoryIfNeeded();

    switch (type) {
      case 'stock': return this.exportStock();
      case 'info': return this.exportProductInfo();
      case 'outbound': return this.exportOutbound('out');
      case 'inbound': return this.exportOutbound('in');
      case 'adjustment_Out': return this.exportOutbound('adjust-out');
      case 'adjustment_In': return this.exportOutbound('adjust-in');
      case 'recommend': return this.exportOrderRecommend();
      default: alert('未知出力类型');
    }
  }

  // =============================
  //    在库 CSV
  // =============================
  private async exportStock() {
    const rows = Object.values(this.productMap).map(p => ({
      商品编号: p.code,
      商品名称: p.name,
      JAN: p.janId,
      分类: p.categoryName,
      颜色: p.colorName,
      型号: p.modleName,
      成本价: p.costPrice,
      售价: p.salePrice,
      库存数量: p.stock ?? 0,
      状态: p.available ? '启用' : '禁用',
    }));

    this.downloadCSV(rows, `总在库信息_${this.formatDate()}`);
  }

  // =============================
  //    产品信息 CSV
  // =============================
  private async exportProductInfo() {
    const rows = Object.values(this.productMap).map(p => ({
      商品编号: p.code,
      商品名称: p.name,
      JAN: p.janId,
      分类: p.categoryName,
      颜色: p.colorName,
      型号: p.modleName,
      成本价: p.costPrice,
      售价: p.salePrice,
      状态: p.available ? '启用' : '禁用',
    }));

    this.downloadCSV(rows, `商品信息_${this.formatDate()}`);
  }

  // =============================
  //   出库/入库/调整 CSV（统一逻辑）
  // =============================
  private async exportOutbound(actionType: string) {
    if (!this.validateDate()) return;

    const { start, end } = this.getDateRange();

    const rows: any[] = [];

    this.cachedHistory!.forEach(doc => {
      const data: any = doc.data();
      const saleDate = data.date?.toDate();
      if (!saleDate) return;

      if (data.actionType !== actionType) return;
      if (saleDate < start || saleDate > end) return;

      const productId = doc.ref.path.split('/')[1];
      const p = this.productMap[productId] || {};

      rows.push({
        商品编号: p.code,
        商品名称: p.name,
        JAN: p.janId,
        分类: p.categoryName,
        颜色: p.colorName,
        型号: p.modleName,
        数量: Math.abs(data.qty),
        仓库: this.dispatchMap[data.dispatchId] || '',
        操作人: data.operator,
        操作日期: saleDate.toLocaleDateString('ja-JP'),
      });
    });

    if (rows.length === 0) return alert('没有记录');

    const nameMap = {
      'out': '出库',
      'in': '入库',
      'adjust-out': '调整出库',
      'adjust-in': '调整入库',
    };

    this.downloadCSV(rows, `${nameMap[actionType]}_${this.startDate}_${this.endDate}`);
  }

  // =============================
  //     推荐订货
  // =============================
  private async exportOrderRecommend() {
    if (!this.targetDays || this.targetDays <= 0) {
      alert('请输入预定库存天数');
      return;
    }

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);

    const salesMap: Record<string, number> = {};

    this.cachedHistory!.forEach(doc => {
      const data: any = doc.data();
      const saleDate = data.date?.toDate();
      if (!saleDate) return;
      if (data.actionType !== 'out') return;
      if (saleDate < start || saleDate > end) return;

      const productId = doc.ref.path.split('/')[1];
      if (!salesMap[productId]) salesMap[productId] = 0;

      salesMap[productId] += Math.abs(data.qty);
    });

    const rows: any[] = [];
    const days = 30;

    Object.keys(this.productMap).forEach(pid => {
      const p = this.productMap[pid];
      if (!p.available) return;

      const totalSales = salesMap[pid] || 0;
      const dailyAvg = totalSales / days;
      //  计算推荐订货量
      // 目标库存 = 日均销量 × 预定天数
      const recommended = Math.ceil(dailyAvg * this.targetDays - (p.stock ?? 0));
      if (recommended <= 0) return;

      rows.push({
        商品编号: p.code,
        商品颜色: p.colorName,
        商品型号: p.modleName,
        商品JAN: p.janId,
        商品名称: p.name,
        当前库存: p.stock,
        近30天销量: totalSales,
        日均销量: dailyAvg.toFixed(2),
        推荐订货量: recommended,
      });
    });

    this.downloadCSV(rows, `订货推荐_${this.formatDate()}`);
  }

  //=====================
  // 工具函数
  //=====================
  private validateDate() {
    if (!this.startDate || !this.endDate) {
      alert('请选择时间区间');
      return false;
    }
    return true;
  }

  private getDateRange() {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    end.setHours(23, 59, 59);
    return { start, end };
  }

  private downloadCSV(data: any[], filename: string) {
    if (!data.length) return alert('没有数据');

    const headers = Object.keys(data[0]).join(',');
    const body = data.map(row => Object.values(row).join(',')).join('\n');

    const csvContent = headers + '\n' + body;
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename + '.csv';
    link.click();
  }

  private formatToday() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  private formatDate() {
    const d = new Date();
    return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  }
}
