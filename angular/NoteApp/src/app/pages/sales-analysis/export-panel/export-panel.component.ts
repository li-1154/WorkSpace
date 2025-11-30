import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { DispatchService } from 'src/app/services/dispatch.service';

@Component({
  selector: 'app-export-panel',
  templateUrl: './export-panel.component.html',
  styleUrls: ['./export-panel.component.css']
})
export class ExportPanelComponent implements OnInit {

  loading = false;

  constructor(private afs: AngularFirestore, private dispatchService: DispatchService) { }

  async export(type: string) {
    if (type === 'stock') {
      await this.exportStock();
    }
    else if (type === 'info') {
      await this.exportProductInfo();
    }
    else if (type === 'outbound') {
      await this.exportOutbound();
    }
    else if (type === 'inbound') {
      await this.exportinbound();
    }

    else {
      alert(type + '');
    }
  }


  private async exportStock() {
    this.loading = true;

    try {
      const snapshot = await this.afs.collection('products').get().toPromise();
      const rows: any[] = [];

      snapshot?.forEach(doc => {
        const data: any = doc.data();
        rows.push(
          {
            商品编号: data.code || '',
            商品名称: data.name || '',
            分类: data.categoryName || '',
            颜色: data.colorName || '',
            库存数量: data.stock ?? 0,
          }
        );
      });

      this.downloadCSV(rows, `总在库信息_${this.formatDate()}`);
      alert('总在库信息文件生成完成');
    }
    catch (error) {
      console.error('❌ 出力失败:', error);
      alert('出力失败，请检查数据或网络连接')
    }
    this.loading = false;
  }

  //产品信息
  private async exportProductInfo() {
    this.loading = true;

    try {
      const snapshot = await this.afs.collection('products').get().toPromise();
      const rows: any[] = [];

      snapshot?.forEach(doc => {
        const data: any = doc.data();
        rows.push(
          {
            商品编号: data.code || '',
            商品名称: data.name || '',
            JAN: data.janId || '',
            分类: data.categoryName || '',
            颜色: data.colorName || '',
            型号: data.modleName || '',
            成本价: data.costPrice || '',
            售价: data.salePrice || '',
            状态: data.available ? "启用" : "禁用"
          }
        );
      });

      this.downloadCSV(rows, `商品信息_${this.formatDate()}`);
      alert('商品信息文件生成完成');
    }
    catch (error) {
      console.error('❌ 出力失败:', error);
      alert('出力失败，请检查数据或网络连接')
    }
    this.loading = false;
  }




  private async exportOutbound() {

    if (!this.startDate || !this.endDate) {
      alert("时间区间未选择");
      return;
    }


    this.loading = true;

    try {

      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      end.setHours(23, 59, 59);

      const fileDate: any[] = [];
      const productMap: Record<string, any> = {};
      const productSnap = await this.afs.collection('products').get().toPromise();
      productSnap?.forEach(doc => productMap[doc.id] = doc.data());


      const historySnap = await this.afs.collectionGroup('stockHistory', ref =>
        ref.where('actionType', 'in', ['out', 'adjust-out'])
          .where('date', '>=', start)
          .where('date', '<=', end)
          .orderBy('date')
      ).get().toPromise();

      console.log('historySnap', historySnap)
      historySnap?.forEach(doc => {
        const data: any = doc.data();
        const productId = doc.ref.parent.parent?.id;
        const product = productMap[productId] || {};
        fileDate.push(
          {
            商品编号: product.code || '',
            商品名称: product.name || '',
            数量: Math.abs(data.qty),
            出库价: data.salePrice || '',
            出库仓: this.dispatchMap[data.dispatchId] || '',
            操作人: data.operator || '',
            操作日期: data.date?.toDate().toLocaleDateString('ja-JP') || ''
          });
      });
      console.log('fileDate', fileDate)



      if (fileDate.length === 0) {
        alert("该期间没有出库的记录");
      }
      else {
        this.downloadCSV(fileDate, `出库_${this.startDate}_${this.endDate}`);
        alert('出库的记录生成完成');
      }
    }
    catch (error) {
      console.error('❌ 出力失败:', error);
      alert('出力失败，请检查数据或网络连接')
    }
    this.loading = false;
  }


  private async exportinbound() {

    if (!this.startDate || !this.endDate) {
      alert("时间区间未选择");
      return;
    }


    this.loading = true;

    try {

      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      end.setHours(23, 59, 59);

      const fileDate: any[] = [];
      const productMap: Record<string, any> = {};
      const productSnap = await this.afs.collection('products').get().toPromise();
      productSnap?.forEach(doc => productMap[doc.id] = doc.data());


      const historySnap = await this.afs.collectionGroup('stockHistory', ref =>
        ref.where('actionType', 'in', ['in', 'adjust-in'])
          .where('date', '>=', start)
          .where('date', '<=', end)
          .orderBy('date')
      ).get().toPromise();

      console.log('historySnap', historySnap)
      historySnap?.forEach(doc => {
        const data: any = doc.data();
        const productId = doc.ref.parent.parent?.id;
        const product = productMap[productId] || {};
        fileDate.push(
          {
            商品编号: product.code || '',
            商品名称: product.name || '',
            数量: Math.abs(data.qty),
            进货价: data.costPrice || '',
            操作人: data.operator || '',
            操作日期: data.date?.toDate().toLocaleDateString('ja-JP') || ''
          });
      });
      console.log('fileDate', fileDate)



      if (fileDate.length === 0) {
        alert("该期间没有入库的记录");
      }
      else {
        this.downloadCSV(fileDate, `入库_${this.startDate}_${this.endDate}`);
        alert('入库的记录生成完成');
      }
    }
    catch (error) {
      console.error('❌ 出力失败:', error);
      alert('出力失败，请检查数据或网络连接')
    }
    this.loading = false;
  }



  //共通下载
  private downloadCSV(data: any[], filename: string) {
    if (!data.length) {
      alert('没有出力的数据!');
      return;
    }
    const headers = Object.keys(data[0]).join(',');
    const body = data.map(row => Object.values(row).join(',')).join('\n');

    const csvContent = headers + '\n' + body;
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename + '.csv';
    link.click();

  }

  //共通格式
  private formatDate() {
    const d = new Date();
    return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  }


  dispatchMap: { [key: string]: string } = {};
  ngOnInit(): void {
    this.dispatchService.getDispatchs().subscribe(list => {
      list.forEach(d => {
        this.dispatchMap[d.id] = d.name;
      });
    });
  }

  startDate: string = '';
  endDate: string = '';

}

