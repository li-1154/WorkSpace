import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Product } from 'src/app/models/product.model';

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
  keyword: string = '';

  colorList: any[] = [];
  selectedColor: string = '';

  constructor(
    private productService: ProductService,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data: any[]) => {
      this.products = data;
      this.filteredProducts = [...data].filter((p) => p.available !== false);
      // ⭐如果用户之前有关键字 → 自动刷新过滤
      if (this.keyword?.trim() || this.selectedColor) {
        this.applyFilter();
      }
    });

    this.firestore
      .collection('colors', ref => ref.where('active', '==', true))
      .get()
      .toPromise()
      .then((res) => {
        this.colorList = res?.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }));
      });
  }

  filteredProducts: Product[] = [];
  applyFilter() {
    const keyword = this.keyword.toLowerCase();
    this.filteredProducts = this.products.filter((p) => {
      const matchKeyword =
        !keyword ||
        p.name.toLowerCase().includes(keyword) ||
        p.code.toLowerCase().includes(keyword) ||
        p.janId.toLowerCase().includes(keyword);
      const matchColor =
        !this.selectedColor || p.colorId === this.selectedColor;
      return matchKeyword && matchColor;
    });
    this.applySort();
    this.currentPage = 1;
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
  actionType: 'in' | 'adjust-in' | 'out' | 'adjust-out' = 'in';
  openStockModal(item: any, type: 'in' | 'out'): void {
    // 在这里打开入库/出库模态框的逻辑
    this.currentItem = {
      ...item, // copy
      costPrice: item.costPrice,
      salePrice: item.salePrice,
    };

    this.stockMode = type;
    this.actionType = type === 'in' ? 'in' : 'out';
    this.showStockModal = true;
  }

  onModalClose(): void {
    this.showStockModal = false;
    this.currentItem = null;
  }

  async onStockSubmitted(event: {
    qty: number;
    note: string;
    actionType: 'in' | 'adjust-in' | 'out' | 'adjust-out';
    costPrice: number;
    salePrice: number;
    dispatchId: string;
    date: Date;
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

    const { qty, note, actionType, costPrice, salePrice, dispatchId, date } =
      event;

    const qtyChange =
      actionType === 'in' || actionType === 'adjust-in' ? qty : -qty;

    const code = this.currentItem.code;

    try {
      await this.productService.updateStock(code, qtyChange);

      const before = this.currentItem.stock || 0;
      const after = before + qtyChange;
      this.currentItem.stock = after;

      await this.productService.addStockHistory(code, {
        qty: qtyChange,
        dispatchId: dispatchId,
        note,
        actionType,
        costPrice:
          actionType === 'in' || actionType === 'adjust-in' ? costPrice : null,
        salePrice:
          actionType === 'out' || actionType === 'adjust-out'
            ? salePrice
            : null,
        operator: operatorName, // 以后可以替换成登录账号
        beforeStock: before,
        afterStock: after,
        date: date,
      });
      if (actionType === 'out') {
        await this.productService.updateMonthlySalesStat(
          Math.abs(qtyChange),
          date
        );
      }
    } catch (error) {
      alert('库存更新失败，请稍后重试');
      return;
    }
    this.showStockModal = false;
    this.currentItem = null;
  }

  sortKey: string = '';

  applySort() {
    switch (this.sortKey) {
      case 'name-asc':
        this.filteredProducts.sort((a, b) => a.code.localeCompare(b.code));
        break;

      case 'name-desc':
        this.filteredProducts.sort((a, b) => b.code.localeCompare(a.code));
        break;

      case 'stock-asc':
        this.filteredProducts.sort((a, b) => (a.stock || 0) - (b.stock || 0));
        break;

      case 'stock-desc':
        this.filteredProducts.sort((a, b) => (b.stock || 0) - (a.stock || 0));
        break;

      case 'price-asc':
        this.filteredProducts.sort(
          (a, b) => (a.salePrice || 0) - (b.salePrice || 0)
        );
        break;

      case 'price-desc':
        this.filteredProducts.sort(
          (a, b) => (b.salePrice || 0) - (a.salePrice || 0)
        );
        break;
    }
  }

  pageSize = 20;
  currentPage = 1;

  get paginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.filteredProducts.length / this.pageSize);
  }
}
