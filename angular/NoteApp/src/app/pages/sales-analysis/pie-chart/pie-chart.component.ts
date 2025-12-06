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
  dispatchMap: Record<string, string> = {}; // 仓库 ID → 名称

  constructor(private afs: AngularFirestore) { }

  /* =============================
   * 初始化
   * ============================= */
  async ngOnInit() {
    await this.loadCategories();
    await this.loadProductMap();
    await this.loadDispatchMap();

    // 默认日期：今天
    const today = this.formatToday();
    this.startDate = today;
    this.endDate = today;

    this.updateChart();
  }

  /* =============================
   * 加载分类
   * ============================= */
  async loadCategories() {
    const snap = await this.afs.collection('categories').get().toPromise();
    this.categories =
      snap?.docs.map(d => ({
        id: d.id,
        ...(d.data() as any),
      })) || [];
  }

  /* =============================
   * 加载产品映射
   * ============================= */
  async loadProductMap() {
    const snap = await this.afs.collection('products').get().toPromise();
    snap?.forEach(doc => {
      this.productMap[doc.id] = doc.data();
    });
  }

  /* =============================
   * 加载仓库映射
   * ============================= */
  async loadDispatchMap() {
    const snap = await this.afs.collection('dispatch').get().toPromise();
    snap?.forEach(doc => {
      const data: any = doc.data();
      this.dispatchMap[doc.id] = data.name || doc.id;
    });
  }

  /* =============================
   * 更新图表（核心）
   * ============================= */
  async updateChart() {
    if (!this.startDate || !this.endDate) return;

    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    end.setHours(23, 59, 59);

    // ✅⭐ 关键优化：最多允许 7 天 ⭐✅
    const diffMs = end.getTime() - start.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;

    if (diffDays > 7) {
      alert(`查询区间请控制在 7 天以内（当前 ${diffDays} 天）`);
      return;
    }

    const warehouseCount: Record<string, number> = {};

    // ✅ 按需查询（不会全量）
    const snap = await this.afs
      .collectionGroup('stockHistory', ref =>
        ref
          .where('actionType', '==', 'out')
          .where('date', '>=', start)
          .where('date', '<=', end)
      )
      .get()
      .toPromise();

    snap?.forEach(doc => {
      const data: any = doc.data();
      const saleQty = Math.abs(data.qty || 0);

      const productId = doc.ref.parent.parent?.id;
      const product = this.productMap[productId];

      // 分类过滤（可选）
      if (this.selectedCategory && product?.categoryId !== this.selectedCategory) {
        return;
      }

      const warehouseId = data.dispatchId || 'unknown';
      warehouseCount[warehouseId] =
        (warehouseCount[warehouseId] || 0) + saleQty;
    });

    this.renderChart(warehouseCount);
  }

  /* =============================
   * 绘制饼图
   * ============================= */
  renderChart(data: Record<string, number>) {
    const rawLabels = Object.keys(data);
    const labels = rawLabels.map(id => this.dispatchMap[id] || id);
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
        title: {
          display: true,
          text: '📦 出库占比分析（按仓库）',
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, chartData) => {
              const value = chartData.datasets![0].data![tooltipItem.index] as number;
              const total = values.reduce((a, b) => a + b, 0);
              const percent = ((value / total) * 100).toFixed(1);
              return `${chartData.labels![tooltipItem.index]}：${value} 件 (${percent}%)`;
            },
          },
        },
      },
    });
  }

  /* =============================
   * 工具函数
   * ============================= */
  private formatToday(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`;
  }
}
