import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.css'],
})
export class StockListComponent implements OnInit {
  currentItem: any | null = null;
  stockMode: 'in' | 'out' = 'in';
  showStockModal = false;
  products: any[];

  constructor(
    private productService: ProductService,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data: any[]) => {
      this.products = data;
    });
  }

  editStock(productId: string): void {
    this.router.navigate(['/stock/edit', productId]);
  }

  viewHistory(productId: string): void {
    this.router.navigate(['/stock/history', productId]);
  }

  selectedItemId: string | null = null;

  toggleSelect(id: string) {
    this.selectedItemId = this.selectedItemId === id ? null : id;
  }

  getColor(stock: number): string {
    if (stock > 10) {
      return 'green';
    } else if (stock > 0) {
      return 'orange';
    } else {
      return 'red';
    }
  }

  openStockModal(item: any, type: 'in' | 'out'): void {
    // 在这里打开入库/出库模态框的逻辑
    this.currentItem = {
      ...item, // copy
      costPrice: item.costPrice,
      salePrice: item.salePrice,
    };
    this.stockMode = type;
    this.showStockModal = true;
  }

  onModalClose(): void {
    this.showStockModal = false;
    this.currentItem = null;
  }

  async onStockSubmitted(event: {
    qty: number;
    note: string;
    type: 'in' | 'out';
    costPrice: number;
    salePrice: number;
  }) {
    if (!this.currentItem) return;

    const user = await this.afAuth.currentUser;
    const uid = user ? user.uid : null;
    let operatorName = '未知用户';
    if (uid) {
      const userDoc = await this.firestore
        .collection('users')
        .doc(uid)
        .get()
        .toPromise();
      operatorName = userDoc?.data()?.['name'] || user.email || '未知用户';
    }

    const { qty, note, type, costPrice, salePrice } = event;

    const qtyChange = type === 'in' ? qty : -qty;

    const code = this.currentItem.code;

    try {
      await this.productService.updateStock(code, qtyChange);

      const before = this.currentItem.stock || 0;
      const after = before + qtyChange;
      this.currentItem.stock = after;

      await this.productService.addStockHistory(code, {
        qty: qtyChange,
        note,
        type,
        costPrice: type === 'in' ? costPrice : null,
        salePrice: type === 'out' ? salePrice : null,
        operator: operatorName, // 以后可以替换成登录账号
        beforeStock: before,
        afterStock: after,
      });
    } catch (error) {
      alert('库存更新失败，请稍后重试');
      return;
    }
    this.showStockModal = false;
    this.currentItem = null;
  }
}
