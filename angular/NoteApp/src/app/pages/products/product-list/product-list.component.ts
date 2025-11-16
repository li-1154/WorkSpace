import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls:['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  filteredProducts: Product[] = [];

  currentTab: 'products' | 'stock' | 'sales' = 'products';


  constructor(private productService: ProductService ,private router:Router) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(res => {
      this.products = res;
      this.filteredProducts = [...res]; // 初始显示全部
    });
  }

  applyFilter(event: any) {
    const keyword = event.target.value.toLowerCase();
    this.filteredProducts = this.products.filter(p =>
      p.name.toLowerCase().includes(keyword) ||
      p.code.toLowerCase().includes(keyword) 
    );
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
delete(id: string)
{}

}
