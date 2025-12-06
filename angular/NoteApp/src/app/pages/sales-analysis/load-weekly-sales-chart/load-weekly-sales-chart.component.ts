import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ProductService } from 'src/app/services/product.service';
import Chart from 'chart.js';

@Component({
  selector: 'app-load-weekly-sales-chart',
  templateUrl: './load-weekly-sales-chart.component.html',
  styleUrls: ['./load-weekly-sales-chart.component.css']
})
export class LoadWeeklySalesChartComponent implements OnInit {

  chart: any = null;

  monthSummary = {
    thisMonth: 0,
    lastMonth: 0
  };

  constructor(private afs: AngularFirestore,
    private productService: ProductService) { }

  async ngOnInit() {
    await this.loadWeeklySalesChart();
  }

  // ✅ 只读 monthly_sales（2 次 read）
  async loadWeeklySalesChart() {
    const now = new Date();

    const thisMonthId = this.formatMonthId(now);
    const lastMonthId = this.formatMonthId(
      new Date(now.getFullYear(), now.getMonth() - 1, 1)
    );

    // ✅ 本月
    const thisSnap = await this.afs
      .collection('monthly_sales')
      .doc(thisMonthId)
      .get()
      .toPromise();

    // ✅ 上月
    const lastSnap = await this.afs
      .collection('monthly_sales')
      .doc(lastMonthId)
      .get()
      .toPromise();

    const weeklyThisMonth = [
      thisSnap?.get('week1') || 0,
      thisSnap?.get('week2') || 0,
      thisSnap?.get('week3') || 0,
      thisSnap?.get('week4') || 0,
    ];

    const weeklyLastMonth = [
      lastSnap?.get('week1') || 0,
      lastSnap?.get('week2') || 0,
      lastSnap?.get('week3') || 0,
      lastSnap?.get('week4') || 0,
    ];

    this.monthSummary = {
      thisMonth: weeklyThisMonth.reduce((a, b) => a + b, 0),
      lastMonth: weeklyLastMonth.reduce((a, b) => a + b, 0),
    };

    this.renderChart(weeklyThisMonth, weeklyLastMonth);
  }

  renderChart(weeklyThisMonth: number[], weeklyLastMonth: number[]) {
    setTimeout(() => {
      const canvas: any = document.getElementById('weeklyChart');
      if (!canvas) return;

      if (this.chart) this.chart.destroy();

      this.chart = new Chart(canvas, {
        type: 'bar',
        data: {
          labels: ['第1周', '第2周', '第3周', '第4周'],
          datasets: [
            {
              label: `本月（合计:${this.monthSummary.thisMonth} 件）`,
              data: weeklyThisMonth,
              backgroundColor: '#42A5F5'
            },
            {
              label: `上月（合计:${this.monthSummary.lastMonth} 件）`,
              data: weeklyLastMonth,
              backgroundColor: '#FFC107'
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            yAxes: [{ ticks: { beginAtZero: true } }]
          }
        }
      });
    }, 100);
  }

  // yyyy-MM
  private formatMonthId(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }
}
