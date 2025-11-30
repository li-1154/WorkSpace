import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-product-sales-chart',
  templateUrl: './product-sales-chart.component.html',
  styleUrls: ['./product-sales-chart.component.css']
})
export class ProductSalesChartComponent implements OnInit {

  dateFilter = 'month';
  displayLimit: number | 'all' = 10;
  chart: any = null;
  monthTotal = 0;       // 全部销量（本月/本周/今天/全部）
  displayTotal = 0;     // 当前榜单显示的合计

  constructor(private afs: AngularFirestore) { }

  ngOnInit() {
    this.loadSales();
  }

  async loadSales() {

    const now = new Date();
    let startDate: Date | null = null;

    if (this.dateFilter === 'today') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (this.dateFilter === 'week') {
      const firstDay = now.getDate() - now.getDay();
      startDate = new Date(now.getFullYear(), now.getMonth(), firstDay);
    } else if (this.dateFilter === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const productsSnap = await this.afs.collection('products').get().toPromise();
    const result: any[] = [];

    for (const doc of productsSnap.docs) {
      const productId = doc.id;
      const productName = (doc.data() as any).name;


      let query = this.afs.collection(`products/${productId}/stockHistory`, ref =>
        ref.where('actionType', '==', 'out')
      );

      if (startDate) {
        query = this.afs.collection(`products/${productId}/stockHistory`, ref =>
          ref.where('actionType', '==', 'out').where('date', '>=', startDate)
        );
      }

      const snap = await query.get().toPromise();
      const totalSales = snap.docs.reduce((sum, d) => {
        return sum + Math.abs((d.data() as any).qty || 0);
      }, 0);

      result.push({ name: productName, totalSales });
    }

    // 排序
    result.sort((a, b) => b.totalSales - a.totalSales);

    // TOP 限制
    let displayData = result;
    if (this.displayLimit !== 'all') {
      displayData = result.slice(0, this.displayLimit);
    }

    // 排序
    result.sort((a, b) => b.totalSales - a.totalSales);

    // ⭐ 全部销量总数（用于顶部展示）
    this.monthTotal = result.reduce((sum, item) => sum + item.totalSales, 0);

    // TOP 限制

    if (this.displayLimit !== 'all') {
      displayData = result.slice(0, this.displayLimit);
    }

    // ⭐ 当前显示数据的合计
    this.displayTotal = displayData.reduce((sum, item) => sum + item.totalSales, 0);

    // 渲染图表
    this.renderChart(displayData);


    this.renderChart(displayData);
  }



  renderChart(data: any[]) {
    const labels = data.map(d => d.name);
    const values = data.map(d => d.totalSales);

    if (this.chart) this.chart.destroy();

    const ctx: any = document.getElementById('productSalesChart');

    this.chart = new Chart(ctx, {
      type: 'horizontalBar',  // Chart.js v2 必须用 horizontalBar
      data: {
        labels: labels,
        datasets: [{
          label: '销量（件）',
          data: values,
          backgroundColor: '#42A5F5'
        }]
      },
      options: {
        responsive: true,
        legend: { display: false },
        scales: {
          xAxes: [{
            ticks: { beginAtZero: true }
          }],
          yAxes: [{
            ticks: { autoSkip: false }
          }]
        }
      }
    });
  }
}
