import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-score-calc',
  templateUrl: './score-calc.component.html',
  styleUrls: ['./score-calc.component.css']
})
export class ScoreCalcComponent implements OnInit, OnDestroy {

  images = [
    'https://picsum.photos/id/1015/700/300',
    'https://picsum.photos/id/1025/700/300',
    'https://picsum.photos/id/1035/700/300'
  ];

  currentIndex = 0;
  timer: any;

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  /** 自动轮播 */
  startAutoSlide(): void {
    this.timer = setInterval(() => {
      this.next();
    }, 4000); // 每 4 秒切换一次
  }

  /** 下一张 */
  next(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  /** 上一张 */
  prev(): void {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  /** 点击圆点跳转 */
  goTo(index: number): void {
    this.currentIndex = index;
    clearInterval(this.timer);
    this.startAutoSlide();
  }
}
