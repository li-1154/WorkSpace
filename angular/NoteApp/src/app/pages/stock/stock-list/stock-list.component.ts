import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.css']
})
export class StockListComponent implements OnInit {

  products: any[] = [];



  constructor(
    private productService: ProductService,
    private router: Router
  ) { }

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
    console.log(`打开${type === 'in' ? '入库' : '出库'}模态框，商品：`, item);
  }

}

