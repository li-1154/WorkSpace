import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { Color, ColorService } from 'src/app/services/color.service';

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
    private colorService: ColorService
  ) {}
  form: FormGroup; // 用来存整个表单的数据
  productId: string | null = null;
  isEdit: boolean = false;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  colors: Color[] = [];

  async ngOnInit(): Promise<void> {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.productId;
    this.form = this.fb.group({
      code: [{ value: '', disabled: true }],
      name: ['', Validators.required],
      categoryId: ['', Validators.required],
      colorId: ['', Validators.required],
      description: [''],
    });

    this.colorService.getColors().subscribe((list) => {
      this.colors = list.filter((x) => x.active !== false);
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

    const data: Product = {
      id: '',
      code: raw.code,
      name: this.form.value.name,
      categoryName: this.form.value.category,
      description: this.form.value.description || '',
      imageUrl: imageUrl,
      categoryId: '',
      colorId: this.form.value.colorId,
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
}
