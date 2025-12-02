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


import { Dispatch, DispatchService } from 'src/app/services/dispatch.service';
import { Modle, ModleService } from 'src/app/services/modle.service';
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
    private categorieService: CategorieService,
    private dispatchService: DispatchService,
    private modleService: ModleService
  ) { }
  form: FormGroup; // 用来存整个表单的数据
  productId: string | null = null;
  isEdit: boolean = false;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  colors: Color[] = [];
  colorslist: Color[] = [];
  categories: Categorie[] = [];
  categorieslist: Categorie[] = [];
  dispatchilist: Dispatch[] = [];
  modlelist: Modle[] = [];
  modles: Modle[] = [];
  mode: 'product' | 'category' | 'color' | 'outbound' | 'modle' = 'product';

  originalImageUrl: string | null = null;


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

      //型号对象：必填
      modleId: ['',],

      // 备注：可空
      description: [''],

      // JAN
      janId: ['',],

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
    return new Promise<void>(resolve => {
      let done = 0;
      const check = () => { if (++done === 2) resolve(); };

      this.categorieService.getCategories().subscribe(list => {
        this.categories = list.filter(x => x.active !== false);
        this.categorieslist = list; // 全部保留
        check();
      });

      this.colorService.getColors().subscribe(list => {
        this.colors = list.filter(x => x.active !== false);
        this.colorslist = list; // 全部保留
        check();
      });

      this.dispatchService.getDispatchs().subscribe(list => {
        this.dispatchilist = list; // 全部保留
        check();
      });

      this.modleService.getModles().subscribe(list => {
        this.modles = list.filter(x => x.active !== false);
        this.modlelist = list; // 全部保留
        check();
      });


    });
  }

  async onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const raw = this.form.getRawValue();
    let imageUrl = this.originalImageUrl || '';
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
      available: true, // 默认启用 '
      modleId: raw.modleId || '',
      modleName: this.modles.find(m => m.id === raw.modleId)?.name || '',
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
    this.originalImageUrl = product.imageUrl || null;

    this.form.patchValue({
      code: product.code,
      name: product.name,
      categoryId: product.categoryId,
      colorId: String(product.colorId),
      description: product.description,
      janId: product.janId,
      costPrice: product.costPrice,
      salePrice: product.salePrice,

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
  newDispatch: string;
  newModle: string;

  //种类追加
  saveCategory() {
    this.categorieService.addCategorie(this.newCategory);
    alert('成功添加分类')
  }
  //种类停用启用
  toggleStatusCategory(item: Categorie) {
    const updatedStatus = !item.active;
    this.categorieService.deactivateCategorie(item.id, updatedStatus);
    item.active = updatedStatus;
  }
  //颜色追加
  saveColor() {
    this.colorService.addColor(this.newColor);
    alert('成功添加颜色')
  }
  editColor(id: string) {

  }
  //颜色停用启用
  togColorgleStatus(item: Color) {
    const updatedStatus = !item.active;
    this.colorService.deactivateColor(item.id, updatedStatus);
    item.active = updatedStatus;
  }

  //出库仓追加
  saveDispatch() {
    this.dispatchService.addDispatch(this.newDispatch);
    alert('成功添加出库仓')
  }
  //出库仓停用启用
  togdispatchleStatus(item: Dispatch) {
    const updatedStatus = !item.active;
    this.dispatchService.deactivateDispatch(item.id, updatedStatus);
    item.active = updatedStatus;
  }

  //型号追加
  saveModle() {
    this.modleService.addModle(this.newModle);
    alert('成功添加型号')
  }

  //型号停用启用
  togModleStatus(item: Modle) {
    const updatedStatus = !item.active;
    this.modleService.deactivateModle(item.id, updatedStatus);
    item.active = updatedStatus;
  }


}
