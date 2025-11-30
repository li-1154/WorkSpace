import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import Chart from 'chart.js';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css'],
})
export class PieChartComponent implements OnInit {
  @ViewChild('outboundCanvas', { static: false }) canvas!: ElementRef;

  chart: Chart | null = null;

  startDate = '';
  endDate = '';
  selectedCategory = '';

  categories: any[] = [];
  productMap: Record<string, any> = {};
  dispatchMap: Record<string, string> = {}; // ⭐ 仓库 ID → 名称映射

  constructor(private afs: AngularFirestore) {}

  async ngOnInit() {
    await this.loadCategories();
    await this.loadProductMap();
    await this.loadDispatchMap();
    // ⭐ 默认日期设为今天
    const today = new Date().toISOString().slice(0, 10);
    this.startDate = today;
    this.endDate = today;

    // ⭐ 自动绘制图表
    this.updateChart();
  }

  /** -------------------------------
   *  加载分类下拉
   -------------------------------- */
  async loadCategories() {
    const snap = await this.afs.collection('categories').get().toPromise();
    this.categories =
      snap?.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Record<string, any>),
      })) || [];
  }

  /** -------------------------------
   *  加载产品映射（用于分类筛选）
   -------------------------------- */
  async loadProductMap() {
    const snap = await this.afs.collection('products').get().toPromise();
    snap?.forEach((doc) => {
      this.productMap[doc.id] = doc.data();
    });
  }

  /** -------------------------------
   *  加载仓库名称映射（dispatch）
   -------------------------------- */
  async loadDispatchMap() {
    const snap = await this.afs.collection('dispatch').get().toPromise();
    snap?.forEach((doc) => {
      const data: any = doc.data();
      this.dispatchMap[doc.id] = data.name || doc.id;
    });
  }

  /** -------------------------------
   *  更新图表
   -------------------------------- */
  async updateChart() {
    if (!this.startDate || !this.endDate) return;

    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    end.setHours(23, 59, 59);

    const warehouseCount: Record<string, number> = {};

    const snap = await this.afs
      .collectionGroup('stockHistory', (ref) =>
        ref
          .where('actionType', 'in', ['out', 'adjust-out'])
          .where('date', '>=', start)
          .where('date', '<=', end)
      )
      .get()
      .toPromise();

    snap?.forEach((doc) => {
      const data: any = doc.data();
      const productId = doc.ref.parent.parent?.id;
      const product = this.productMap[productId];

      // 分类筛选（非必选）
      if (this.selectedCategory && product.categoryId !== this.selectedCategory)
        return;

      const warehouseId = data.dispatchId || 'unknown';
      const qty = Math.abs(data.qty || 0);

      warehouseCount[warehouseId] = (warehouseCount[warehouseId] || 0) + qty;
    });

    this.renderChart(warehouseCount);
  }

  /** -------------------------------
   *  绘制饼状图（甜甜圈）
   -------------------------------- */
  renderChart(data: Record<string, number>) {
    const rawLabels = Object.keys(data);
    const labels = rawLabels.map((id) => this.dispatchMap[id] || id); // ⭐ 转成仓库名称

    const values = Object.values(data);

    if (this.chart) this.chart.destroy();

    const ctx = this.canvas.nativeElement.getContext('2d');

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: [
              '#4CAF50',
              '#FFC107',
              '#2196F3',
              '#E91E63',
              '#9C27B0',
              '#FF5722',
              '#3F51B5',
              '#009688',
            ],
          },
        ],
      },
      options: {
        responsive: true,
        legend: { position: 'bottom' },
        title: { display: true, text: '📦 出库占比分析（按仓库）' },
        tooltips: {
          callbacks: {
            label: (tooltipItem, chartData) => {
              const value = chartData.datasets![0].data![
                tooltipItem.index
              ] as number;
              const total = values.reduce((a, b) => a + b, 0);
              const percent = ((value / total) * 100).toFixed(1);

              return ` ${
                chartData.labels![tooltipItem.index]
              } — ${value} 件 (${percent}%)`;
            },
          },
        },
      },
    });
  }
}
