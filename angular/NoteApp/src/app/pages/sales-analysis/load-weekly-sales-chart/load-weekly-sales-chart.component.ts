import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import Chart from 'chart.js';

@Component({
  selector: 'app-load-weekly-sales-chart',
  templateUrl: './load-weekly-sales-chart.component.html',
  styleUrls: ['./load-weekly-sales-chart.component.css']
})
export class LoadWeeklySalesChartComponent implements OnInit {
  chart: any = null;

  constructor(private afs: AngularFirestore) { }

  ngOnInit() {
    this.loadWeeklySalesChart();
  }

  async loadWeeklySalesChart() {
    const now = new Date();

    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const weeklyThisMonth = [0, 0, 0, 0];
    const weeklyLastMonth = [0, 0, 0, 0];

    /*******************************************
     *  ⬇ ⬇ ⬇ 关键优化：只查询一次 stockHistory ⬇⬇⬇
     *******************************************/
    const salesSnap = await this.afs.collectionGroup('stockHistory', ref =>
      ref
        .where('actionType', '==', 'out')
        .where('date', '>=', lastMonthStart)
        .where('date', '<', nextMonthStart)
    ).get().toPromise();
    /*******************************************
     *  ⬆ ⬆ ⬆ 优化结束 — 上面一步就够了   ⬆⬆⬆
     *******************************************/

    salesSnap.docs.forEach(doc => {
      const data: any = doc.data();
      const qty = Math.abs(data.qty || 0);
      const saleDate = data.date?.toDate();
      if (!saleDate) return;

      const weekIndex = this.getWeekIndex(saleDate);

      if (saleDate >= currentMonthStart) {
        weeklyThisMonth[weekIndex] += qty;
      } else {
        weeklyLastMonth[weekIndex] += qty;
      }
    });

    this.renderChart(weeklyThisMonth, weeklyLastMonth);
  }

  getWeekIndex(date: Date): number {
    const day = date.getDate();
    if (day <= 7) return 0;
    if (day <= 14) return 1;
    if (day <= 21) return 2;
    return 3;
  }

  monthSummary = { thisMonth: 0, lastMonth: 0 };

  renderChart(weeklyThisMonth: number[], weeklyLastMonth: number[]) {
    setTimeout(() => {
      const canvas: any = document.getElementById('weeklyChart');
      if (!canvas) return;

      if (this.chart) this.chart.destroy();

      const totalThisMonth = weeklyThisMonth.reduce((a, b) => a + b, 0);
      const totalLastMonth = weeklyLastMonth.reduce((a, b) => a + b, 0);

      this.monthSummary = { thisMonth: totalThisMonth, lastMonth: totalLastMonth };

      this.chart = new Chart(canvas, {
        type: 'bar',
        data: {
          labels: ['第1周', '第2周', '第3周', '第4周'],
          datasets: [
            { label: `本月（合计:${totalThisMonth} 件）`, data: weeklyThisMonth, backgroundColor: '#42A5F5' },
            { label: `上月（合计:${totalLastMonth} 件）`, data: weeklyLastMonth, backgroundColor: '#FFC107' }
          ]
        },
        options: {
          responsive: true,
          scales: { yAxes: [{ ticks: { beginAtZero: true } }] }
        }
      });
    }, 100);
  }
}
