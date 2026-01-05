import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  filteredProducts: Product[] = [];


  constructor(private productService: ProductService, private router: Router) {
  }



  ngOnInit() {
    console.log("ProductListComponent 初始化！");
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
  // 跳转输入框绑定的值
  jumpPage: number = 1;

  get paginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.filteredProducts.length / this.pageSize);
  }

  /** 中间显示的页码数量 */
  private windowSize = 3;

  /** 生成：1 2 3 ... */
  get paginationItems(): Array<number | '...'> {
    const total = this.totalPages;
    const current = this.currentPage;

    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const items: Array<number | '...'> = [];
    items.push(1);

    if (current > 3) items.push('...');

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
      items.push(i);
    }

    if (current < total - 2) items.push('...');

    items.push(total);
    return items;
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }


  searchKeyword = '';
  availabilityFilter: 'all' | 'available' | 'unavailable' = 'all';

  applyFilter() {
    const keyword = this.searchKeyword.toLowerCase();

    this.filteredProducts = this.products.filter(item => {
      // 1️⃣ 关键词匹配
      const matchKeyword =
        item.name.toLowerCase().includes(keyword) ||
        item.code.toLowerCase().includes(keyword);

      // 2️⃣ available 筛选
      let matchAvailability = true;
      if (this.availabilityFilter === 'available') {
        matchAvailability = item.available === true;
      } else if (this.availabilityFilter === 'unavailable') {
        matchAvailability = item.available === false;
      }

      return matchKeyword && matchAvailability;
    });

    // 筛选后重置分页
    this.currentPage = 1;
    this.jumpPage = 1;
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
