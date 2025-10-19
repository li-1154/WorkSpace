import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ProductsComponent } from './products.component'
import { AppComponent } from './app.component';
import { ProductService } from './product.service';
import { RatingComponet } from './rating.componet';
import { ProductComponent } from './product.componet'
import { TrunCatePipe } from './truncate.pipe';

@NgModule({
  declarations: [
    AppComponent, ProductsComponent, RatingComponet, ProductComponent, TrunCatePipe
  ],
  imports: [
    BrowserModule
  ],
  //providers 应用程序所需要的所有依赖包
  providers: [ProductService],
  //bootstrapq 启动程序
  bootstrap: [AppComponent]
})
export class AppModule { }
