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
  ) { }
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

      // 商品名称：必填 + 最多15文字
      name: ['', [Validators.required, Validators.maxLength(15)]],

      // 分类：必填
      categoryId: ['', Validators.required],

      // 颜色：必填
      colorId: ['', Validators.required],

      // 备注：可空
      description: [''],

      // JAN：必填 + 只能数字 + 必须11位
      janId: ['', [
        Validators.required,
        Validators.pattern(/^[A-Za-z0-9]{1,11}$/)
        // 👈 必须是11位数字
      ]],

      // 价格：必填 + 只能数字 + 允许小数点后2位
      costPrice: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)
      ]],

      salePrice: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)
      ]]
    });


    await this.loadLists();
    if (this.isEdit) {
      console.log('编辑模式，加载商品数据' + this.productId);
      await this.loadProduct();
    } else {
      await this.generateProductCode();
      console.log('新增模式，生成新商品编码');
    }
  }

  loadLists() {
    return new Promise<void>((resolve) => {
      let done = 0;
      const check = () => { if (++done === 2) resolve(); };
      this.categorieService.getCategories().subscribe(list => {
        this.categories = list.filter(x => x.active !== false);
        check();
      });

      this.colorService.getColors().subscribe(list => {
        this.colors = list.filter(x => x.active !== false);
        check();
      });
    });
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
      id: this.productId || '',
      code: raw.code,
      name: raw.name,
      janId: raw.janId,
      categoryId: raw.categoryId,
      categoryName: category ? category.name : '', // ⭐ 自动补
      description: raw.description || '',
      imageUrl: imageUrl,
      colorId: raw.colorId,
      colorName: color ? color.name : '',
      costPrice: raw.costPrice || '',
      salePrice: raw.salePrice || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (this.isEdit) {
      await this.productService.updateProduct(this.productId!, data);
      alert('商品已更新');
    } else {
      this.productService.createProduct(data).then(() => {
        alert('商品已新增');
      });
    }
    this.router.navigate(['/products']);
  }

  async generateProductCode() {
    const lastCode = await this.productService.getLastProductCode();
    const num = parseInt(lastCode.replace('P', '')) + 1;

    const newCode = 'P' + num.toString().padStart(5, '0');
    this.form.patchValue({ code: newCode });
  }

  async loadProduct() {
    if (!this.productId) {
      console.log('加载不到商品数据');
      return;
    }
    const product =
      await this.productService.getProductById(this.productId).toPromise();
    console.log('加载到的商品数据=', product);
    if (!product) {
      alert('找不到该商品');
      return;
    }
    this.previewUrl = product.imageUrl || null;

    this.form.patchValue({
      code: product.code,
      name: product.name,
      categoryId: product.categoryId,
      colorId: String(product.colorId),
      description: product.description,
      janId: product.janId,
      costPrice: product.costPrice,
      salePrice: product.salePrice
    });
    console.log('已回显颜色 =', this.form.value.colorId);
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
  newCategory: string;
  newColor: string;

  //种类追加
  saveCategory() {
    this.categorieService.addCategorie(this.newCategory);
    alert('成功添加分类')
  }
  //种类删除
  deleteCategory(id: string) {
    //confirm() 就是浏览器自带的 确认弹窗，带 “确定” 和 “取消” 两个按钮。
    const yes = confirm("确认要删除吗?删除产品分类需要谨慎操作!!!")
    if (!yes) return;
    this.categorieService.deleteCategorie(id);
    alert('已经删除此分类')
  }
  //颜色追加
  saveColor() {
    this.colorService.addColor(this.newColor);
    alert('成功添加颜色')
  }
  editColor(id: string) {

  }
  //颜色删除
  deleteColor(id: string) {
    const yes = confirm("确认要删除吗?删除颜色分类需要谨慎操作!!!")
    if (!yes)
      return;
    this.colorService.deleteColor(id);
    alert("成功删除颜色!")
  }
}
