import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Modle, ModleService } from 'src/app/services/modle.service';

interface SalesRow {
  商品名称: string;
  商品编号: string;
  商品JAN: string;
  型号: string;
  颜色: string;
  销售数量: number;
}

@Component({
  selector: 'app-product-sales-chart',
  templateUrl: './product-sales-chart.component.html',
  styleUrls: ['./product-sales-chart.component.css']
})
export class ProductSalesChartComponent implements OnInit {

  startDate = '';
  endDate = '';

  salesResult: SalesRow[] = [];

  /** 缓存 */
  private productMap: Record<string, any> = {};
  private colorMap: Record<string, string> = {};

  /** ✅ 和既存一致 */
  modles: Modle[] = [];

  constructor(
    private afs: AngularFirestore,
    private modleService: ModleService
  ) { }

  async ngOnInit() {
    await Promise.all([
      this.loadProductsOnce(),
      this.loadColors(),
      this.loadModles(),   // ✅ 新增：从 ModleService 来
    ]);

    const today = this.formatToday();
    this.startDate = today;
    this.endDate = today;

    this.loadSales();
  }

  onDateChanged() {
    if (!this.startDate || !this.endDate) return;

    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    const diffDays =
      Math.floor((end.getTime() - start.getTime()) / 86400000) + 1;

    if (diffDays > 7) {
      alert(`查询区间请控制在 7 天以内（当前 ${diffDays} 天）`);
      return;
    }

    this.loadSales();
  }

  async loadSales() {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    end.setHours(23, 59, 59, 999);

    const salesMap: Record<string, number> = {};

    const snap = await this.afs
      .collectionGroup('stockHistory', ref =>
        ref
          .where('actionType', '==', 'out')
          .where('date', '>=', start)
          .where('date', '<=', end)
      )
      .get()
      .toPromise();

    console.log('✅ stockHistory 查到条数:', snap?.size);

    snap?.docs.forEach(doc => {
      const data: any = doc.data();
      const qty = Math.abs(data.qty || 0);

      const productId = doc.ref.path.split('/')[1];
      if (!productId) return;

      salesMap[productId] = (salesMap[productId] || 0) + qty;
    });

    this.salesResult = Object.keys(salesMap)
      .map(productId => {
        const p = this.productMap[productId];
        if (!p) return null;

        return {
          商品名称: p.name,
          商品编号: p.code,
          商品JAN: p.janId,

          /** ✅ 完全复用既存逻辑 */
          型号:
            p.modleName ||
            this.modles.find(m => m.id === p.modleId)?.name ||
            '',

          颜色: this.colorMap[p.colorId] || '',
          销售数量: salesMap[productId],
        } as SalesRow;
      })
      .filter(Boolean)
      .sort((a, b) => b!.销售数量 - a!.销售数量);
    this.currentPage = 1;

  }

  private async loadProductsOnce() {
    const snap = await this.afs.collection('products').get().toPromise();
    snap?.docs.forEach(doc => {
      this.productMap[doc.id] = doc.data();
    });
  }

  private async loadColors() {
    const snap = await this.afs.collection('colors').get().toPromise();
    snap?.docs.forEach(doc => {
      this.colorMap[doc.id] = (doc.data() as any).name;
    });
  }

  /** ✅ 从既存 ModleService 取 */
  private loadModles(): Promise<void> {
    return new Promise(resolve => {
      this.modleService.getModles().subscribe(list => {
        this.modles = list.filter(m => m.active !== false);
        resolve();
      });
    });
  }

  private formatToday(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`;
  }

  pageSize = 10;     // 每页条数
  currentPage = 1;  // 当前页


  get totalPages(): number {
    return Math.ceil(this.salesResult.length / this.pageSize);
  }


  get pagedSales(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.salesResult.slice(start, start + this.pageSize);
  }



  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }



}
