import { Component } from '@angular/core';
import { ProductService } from './product.service';

@Component({
    selector: 'products-root',
    template: `
    <!-- <h1> {{title}}</h1> -->
    <div *ngIf="products.length==0;else loading">
      NO PRODUCTS TO DISPLAY
    </div>
    <ng-template #loading>
                <div *ngFor="let product of products">
                    <product [data]="product"></product>
                </div>
    </ng-template>         `,
    providers: [ProductService]
})
export class ProductsComponent {

    title = "ProductsComponent";
    products;
    constructor(productService: ProductService) {
        this.products = productService.getproducts();
    }

}
