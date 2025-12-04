import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-product-sales-chart',
  templateUrl: './product-sales-chart.component.html',
  styleUrls: ['./product-sales-chart.component.css']
})
export class ProductSalesChartComponent implements OnInit {

  startDate: string;
  endDate: string;
  salesResult: any[] = [];

  constructor(private afs: AngularFirestore) { }

  ngOnInit() {
    const today = (() => {
      const d = new Date();
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    })();

    this.startDate = today;
    this.endDate = today;

    this.loadSales();
  }

  async loadSales() {
    if (!this.startDate || !this.endDate) return;

    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    end.setHours(23, 59, 59, 999);

    // 先一次性读取所有商品（只查一次）
    const productSnap = await this.afs.collection('products').get().toPromise();
    const productMap: Record<string, string> = {};
    productSnap.docs.forEach(doc => {
      productMap[doc.id] = (doc.data() as any).name;
    });

    /*******************************************
     * 关键优化：一次 collectionGroup 查询所有出库记录
     *******************************************/
    const salesSnap = await this.afs.collectionGroup('stockHistory', ref =>
      ref
        .where('actionType', '==', 'out')
        .where('date', '>=', start)
        .where('date', '<=', end)
    ).get().toPromise();

    // 确保以 { productId: totalSales } 聚合
    const salesMap: Record<string, number> = {};

    salesSnap.docs.forEach(doc => {
      const data: any = doc.data();
      const qty = Math.abs(data.qty || 0);

      // 从 collectionGroup 路径中提取 productId
      // 路径格式: products/{productId}/stockHistory/{docId}
      const segments = doc.ref.path.split('/');
      const productId = segments[1];

      if (!salesMap[productId]) salesMap[productId] = 0;
      salesMap[productId] += qty;
    });

    // 转换成输出格式
    const result: any[] = [];
    Object.keys(salesMap).forEach(productId => {
      if (!productMap[productId]) return; // 避免不存在的产品
      result.push({
        name: productMap[productId],
        totalSales: salesMap[productId]
      });
    });

    // 数量排序
    this.salesResult = result.sort((a, b) => b.totalSales - a.totalSales);

    console.log(this.salesResult);
  }

  onDateChanged() {
    this.loadSales();
  }

}
