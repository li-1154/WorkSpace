import { Component, AfterViewInit } from '@angular/core';
declare const Chart: any;
@Component({
  selector: 'app-simple-from',
  templateUrl: './simple-from.component.html',
  styleUrls: ['./simple-from.component.css']
})
export class SimpleFromComponent {
  ngAfterViewInit() {
    this.renderRadarChart();
    this.renderLineChart();
  }
  // ✅ 确保 DOM 加载完成后才渲染图表
  private renderRadarChart() {
    const ctx = document.getElementById('myRadarChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('❌ Canvas 元素未找到');
      return;
    }

    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['スピード', '力', '技術', '知識', '集中力', '運'],
        datasets: [{
          label: '社員A',
          data: [70, 65, 80, 90, 75, 60],
          fill: true,
          backgroundColor: 'rgba(22,73,128,0.3)',
          borderColor: '#164980',
          pointBackgroundColor: '#164980'
        },
        {
          label: '社員B',
          data: [10, 25, 30, 10, 25, 60],
          fill: true,
          backgroundColor: 'rgba(22,73,128,0.3)',
          borderColor: '#0b691bff',
          pointBackgroundColor: '#0b691bff'
        },
        {
          label: '社員C',
          data: [50, 43, 15, 21, 15, 34],
          fill: true,
          borderColor: '#aed111ff',
          pointBackgroundColor: '#aed111ff'
        }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right', // ✅ 放右侧
            align: 'end',      // ✅ 右下角排列
            labels: {
              boxWidth: 25,    // ✅ 长条长度
              boxHeight: 2,    // ✅ 稍微厚一点，看得清楚
              padding: 1,      // ✅ 各项之间留空
              borderRadius: 5, // ✅ 微圆角
              font: { size: 5 }, // ✅ 稍微大点更清晰
              color: '#333'    // ✅ 深灰字更清楚
            }
          },
          title: {
            display: true,
            text: '社員能力比較レーダーチャート',
            position: 'top',
            font: {
              size: 15,          // ✅ 标题稍微大一些
              weight: 'bold'
            },
            color: '#444'
          }
        },
        scales: {
          r: {
            suggestedMin: 0,
            suggestedMax: 100,
            ticks: {
              stepSize: 20,
              color: '#666',
              font: { size: 9 }
            },
            pointLabels: {
              font: { size: 7 },
              padding: 8
            }
          }
        }
      }

    });
  }
  /**
     * 📈 月別売上推移 折れ線グラフ
     */
  private renderLineChart() {
    const ctx2 = document.getElementById('myLineChart') as HTMLCanvasElement;
    if (!ctx2) {
      console.warn('⚠️ Line chart canvas not found');
      return;
    }

    const labels = ['1月', '2月', '3月', '4月', '5月', '6月', '8月', '9月', '10月', '11月', '12月'];
    const data = {
      labels,
      datasets: [{
        label: '売上推移',
        data: [5, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81],
        fill: false,
        borderColor: '#164980',
        backgroundColor: 'rgba(22,73,128,0.3)',
        tension: 0.3,
        pointRadius: 3
      }]
    };

    new Chart(ctx2, {
      type: 'line',
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: '月別売上推移',
            font: { size: 7, weight: 'bold' },
            color: '#333'
          },

          legend: {
            display: false,
          }
        },
        scales: {
          y: {
            min: 0,
            max: 120,
            ticks: {
              font: { size: 7 },
              maxRotation: 0,
              stepSize: 20   // ✅ 每隔20显示一个刻度
            }
          },
          x: {
            min: 0,
            max: 120,
            ticks: {
              font: { size: 7 },
              maxRotation: 0,
              stepSize: 20   // ✅ 每隔20显示一个刻度
            }
          }

        }
      }
    });
  }
  // ボタン押下の操作　SWITCH case适用方法
  lineColor: string = '#e41717ff';
  currentView: string = 'calc';
  multiAction(view: string): void {
    this.currentView = view;
    switch (view) {
      case 'calc':
        this.lineColor='#0eadd4';
        //this.calculateScore();
        break;
      case 'status':
        this.lineColor='#2aa84f';
        //this.showWorkStatus();
        break;
      case 'modify':
        this.lineColor='#ff9f00';
        //this.correctTimecard();
        break;
      case 'shift':
        this.lineColor='#164980';
        //this.checkShift();
        break;
      case 'salary':
        this.lineColor='#7b3ce9';
        this.viewSalary();
        break;
      case 'logout':
        this.lineColor='#d93732';
        this.logout();
        alert("·ログアウトしました。")
        break;
    }

  }


  // // 点击按钮时更新颜色
  // setLineColor(color: string): void {
  //   this.lineColor = color;
  //   console.log('Line color changed to:', color); // ✅ 调试输出
  // }

  viewSalary() { }

  logout() { }

}



