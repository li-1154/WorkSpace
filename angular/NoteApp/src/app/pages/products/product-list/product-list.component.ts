import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  filteredProducts: Product[] = [];

  currentTab: 'products' | 'stock' | 'sales' = 'products';


  constructor(private productService: ProductService, private router: Router) {
  }

  ngOnInit() {
    this.loadProducts();
  }


  loadProducts() {
    this.productService.getProducts().subscribe(res => {
      this.products = res;
      this.filteredProducts = [...res]; // 初始显示全部
    });
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

  applyFilter(event: any) {
    const keyword = event.target.value.toLowerCase();
    this.filteredProducts = this.products.filter(
      item =>
        item.name.toLowerCase().includes(keyword) ||
        item.code.toLowerCase().includes(keyword)
    );
    this.currentPage = 1;
  }

  getThumbUrl(url: string): string {
    if (!url) return '';
    return url.replace('/upload/', '/upload/w_80,h_80,c_fill,q_70/');
  }


  addProduct() {
    this.router.navigate(['/products/new']);
  }

  editProduct(id: string) {
    this.router.navigate(['/products/edit', id]);

  }


  selectedItemId: string | null = null;

  toggleSelect(itemId: string) {
    this.selectedItemId = this.selectedItemId === itemId ? null : itemId;
  }

  toggleStatus(item: Product) {
    const updatedStatus = !item.available;
    this.productService.updateProductStatus(item.id, updatedStatus);
    item.available = updatedStatus;
  }


}
