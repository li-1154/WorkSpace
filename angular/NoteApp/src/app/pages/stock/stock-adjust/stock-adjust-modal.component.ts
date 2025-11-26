import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Dispatch, DispatchService } from 'src/app/services/dispatch.service';
@Component({
  selector: 'app-stock-adjust-modal',
  templateUrl: './stock-adjust-modal.component.html',
  styleUrls: ['./stock-adjust-modal.component.css'],
})
export class StockAdjustModalComponent implements OnInit {
  constructor(private dispatchService: DispatchService) { }
  dispatchilist: Dispatch[] = [];
  ngOnInit(): void {
    this.dispatchService.getDispatchs().subscribe((list) => {
      this.dispatchilist = list.filter((d) => d.active !== false);
      console.log('list', list); // 全部保留
    });
  }

  @Input() item: any | null = null;
  @Input() actionType: 'in' | 'adjust-in' | 'out' | 'adjust-out' = 'in';


  @Output() submitted = new EventEmitter<{
    qty: number;
    note: string;
    dispatchId: string;
    actionType: 'in' | 'adjust-in' | 'out' | 'adjust-out';
    costPrice: number | null;
    salePrice: number | null;
  }>();

  @Output() closed = new EventEmitter<void>();
  get title() {
    if (this.actionType === 'adjust-in') {
      return '入库调整';
    }
    if (this.actionType === 'adjust-out') {
      return '出库调整';
    }
    if (this.actionType === 'in') {
      return '入库';
    }
    if (this.actionType === 'out') {
      return '出库';
    }
  }

  qty: number = 0;
  note: string = '';
  dispatchId: string = ''; // 出库仓

  onConfirm() {
    if (this.qty <= 0) {
      alert('数量必须大于0');
      return;
    }
    this.submitted.emit({
      qty: this.qty,
      note: this.note,
      dispatchId: this.dispatchId,
      actionType: this.actionType,
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
      if (this.actionType === 'in') {
        this.costPrice = this.item.costPrice;
      } else {
        this.salePrice = this.item.salePrice;
      }
    }
  }
}
