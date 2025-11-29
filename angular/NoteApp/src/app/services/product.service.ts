import { Injectable } from '@angular/core';
import { AngularFirestore, } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { AngularFireStorage } from '@angular/fire/storage';
import { map, take } from 'rxjs/operators';
import firebase from 'firebase/app';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private collectionName = 'products';
  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage
  ) { }

  getProducts(): Observable<Product[]> {
    return this.afs
      .collection<Product>('products', (ref) => ref.orderBy('code', 'asc'))
      .valueChanges({ idField: 'id' });
  }

  createProduct(product: Product) {
    return this.afs
      .collection(this.collectionName)
      .doc(product.code)
      .set(product);
  }

  updateProduct(id: string, product: Product) {
    return this.afs.collection(this.collectionName).doc(id).update(product);
  }

  getProductById(id: string) {
    return this.afs
      .collection<Product>(this.collectionName)
      .doc(id)
      .valueChanges()
      .pipe(
        take(1),
        map((data) => (data ? { id, ...data } : null))
      );
  }

  /**
   * 获取数据库中最后（最大）的一条商品编号
   * 用于自动生成下一个编号，例如：
   * 数据库最大编号是 P00015 → 下一个编号就是 P00016
   */
  getLastProductCode(): Promise<string> {
    return new Promise((resolve, reject) => {
      // 从 Firestore 的 "products" 集合查询，
      // 按照 code 字段降序排序（desc = 从大到小），只取 1 条
      this.afs
        .collection<Product>('products', (ref) =>
          ref.where('code', '!=', '').orderBy('code', 'desc').limit(1)
        )
        .get() // 执行查询
        .subscribe(
          // 查询成功回调
          (snapshot) => {
            // 如果数据库里还没有任何商品
            // snapshot.empty = true
            if (snapshot.empty) {
              // 返回一个初始值（相当于 0）
              // 让下一步生成编号变成 P00001
              resolve('P00000');
            } else {
              // 如果有数据，取查询结果中的第一条记录
              const lastDoc = snapshot.docs[0].data() as Product;

              // lastDoc.code 例如 "P00015"
              resolve(lastDoc.code);
            }
          },

          // 查询失败回调（网络错误、权限限制等）
          (error) => reject(error)
        );
    });
  }

  // 上传图片

  async uploadProductImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    // 🔴 使用你刚刚在 Cloudinary 创建的 preset 名
    formData.append('upload_preset', 'product_images');

    // 🔴 使用你的 Cloud Name
    const cloudName = 'dnwh5qvwc';

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();

    if (!data.secure_url) {
      throw new Error('图片上传失败');
    }

    return data.secure_url;
  }

  updateProductStatus(id: string, available: boolean) {
    return this.afs
      .collection(this.collectionName)
      .doc(id)
      .update({ available });
  }

  updateStock(productCode: string, qtyChange: number) {
    return this.afs
      .collection(this.collectionName)
      .doc(productCode)
      .update({
        stock: firebase.firestore.FieldValue.increment(qtyChange),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
  }

  addStockHistory(productCode: string, data: any) {
    return this.afs
      .collection(this.collectionName)
      .doc(productCode)
      .collection('stockHistory')
      .add({
        ...data,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
  }
}
