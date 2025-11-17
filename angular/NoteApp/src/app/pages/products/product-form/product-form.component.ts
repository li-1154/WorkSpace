import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { Color, ColorService } from 'src/app/services/color.service';
import {
  Categorie,
  CategorieService,
} from 'src/app/services/categorie.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent implements OnInit {
  @ViewChild('filePicker') filePicker: any;
  @ViewChild('cameraInput') cameraInput: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private colorService: ColorService,
    private categorieService: CategorieService
  ) {}
  form: FormGroup; // 用来存整个表单的数据
  productId: string | null = null;
  isEdit: boolean = false;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  colors: Color[] = [];
  categories: Categorie[] = [];
  mode: 'product' | 'category' | 'color' = 'product';


  async ngOnInit(): Promise<void> {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.productId;
    this.form = this.fb.group({
      code: [{ value: '', disabled: true }],
      name: ['', Validators.required],
      categoryId: ['', Validators.required],
      colorId: ['', Validators.required],
      description: [''],
      janId:[''],
      costPrice:[''],
      salePrice:['']
    });

    this.colorService.getColors().subscribe((list) => {
      this.colors = list.filter((x) => x.active !== false);
    });

    this.categorieService.getCategories().subscribe((list) => {
      this.categories = list.filter((x) => x.active !== false);
    });

    if (this.isEdit) {
      this.loadProduct();
    } else {
      await this.generateProductCode();
    }
  }

  async onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const raw = this.form.getRawValue();
    let imageUrl = raw.imageUrl || null;
    if (this.selectedFile) {
      imageUrl = await this.productService.uploadProductImage(
        this.selectedFile
      );
    }

    const category = this.categories.find(
      (d) => d.id === this.form.value.categoryId
    );
    const color = this.colors.find((c) => c.id === this.form.value.colorId);

    const data: Product = {
      id: '',
      code: raw.code,
      name: this.form.value.name,
      janId: this.form.value.janId,
      categoryId: this.form.value.categoryId,
      categoryName: category ? category.name : '', // ⭐ 自动补
      description: this.form.value.description || '',
      imageUrl: imageUrl,
      colorId: this.form.value.colorId,
      colorName: color ? color.name : '',
      costPrice: this.form.value.costPrice || '',
      salePrice: this.form.value.salePrice || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (this.isEdit) {
    } else {
      this.productService.createProduct(data).then(() => {
        alert('商品已新增');
        this.router.navigate(['/products']);
      });
    }

    const formValue = this.form.getRawValue();
    console.log('提交表单数据=', formValue);
    alert('先确认表单能提交，后面再接 Firebase～');
  }

  async generateProductCode() {
    const lastCode = await this.productService.getLastProductCode();
    const num = parseInt(lastCode.replace('P', '')) + 1;

    const newCode = 'P' + num.toString().padStart(5, '0');
    this.form.patchValue({ code: newCode });
  }

  loadProduct() {
    if (!this.productId) {
      return;
    }
  }

  // 相片上传功能
  openPicker() {
    this.filePicker.nativeElement.click();
  }
  // 相片拍照功能
  openCamera() {
    this.cameraInput.nativeElement.click();
  }

  clearImage() {
    this.selectedFile = null;
    this.previewUrl = null;
  }

  onFileSelected(e: any) {
    const input = e.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    this.selectedFile = input.files[0];

    const reader = new FileReader();
    reader.onload = () => (this.previewUrl = reader.result);
    reader.readAsDataURL(this.selectedFile);
  }

//新增颜色追加  种类追加
newCategory:string;
newColor:string;

//种类追加
saveCategory(){

}
//种类删除
deleteCategory(id:string)
{

}
//颜色追加
saveColor()
{

}
editColor(id:string)
{

}
//颜色删除
deleteColor(id:string)
{

}
}
