import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-stock-adjust-modal',
  templateUrl: './stock-adjust-modal.component.html',
  styleUrls: ['./stock-adjust-modal.component.css'],
})
export class StockAdjustModalComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  @Input() item: any | null = null;
  @Input() type: 'in' | 'out' = 'in';

  @Output() submitted = new EventEmitter<{
    qty: number;
    note: string;
    type: 'in' | 'out';
    costPrice: number | null;
    salePrice: number | null;
  }>();

  @Output() closed = new EventEmitter<void>();
  get title() {
    return this.type === 'in' ? '入库调整' : '出库调整';
  }

  qty: number = 0;
  note: string = '';

  onConfirm() {
    if (this.qty <= 0) {
      alert('数量必须大于0');
      return;
    }
    this.submitted.emit({
      qty: this.qty,
      note: this.note,
      type: this.type,
      costPrice: this.costPrice,
      salePrice: this.salePrice,
    });
  }

  onClose() {
    this.closed.emit();
  }
  costPrice: number | null = null;
  salePrice: number | null = null;

  ngOnChanges(): void {
    if (this.item) {
      if (this.type === 'in') {
        this.costPrice = this.item.costPrice;
      } else {
        this.salePrice = this.item.salePrice;
      }
    }
  }
}
