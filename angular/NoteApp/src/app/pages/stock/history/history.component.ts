import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { DispatchService } from 'src/app/services/dispatch.service';
import { ProductService } from 'src/app/services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {


  constructor(private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private dispatchService: DispatchService,
    private productService: ProductService,
    private router: Router
  ) { }


  history: any[] = [];
  filtered: any[] = [];
  keyword = '';
  filterType = '';
  jumpCode = '';
  products: any[] = []; // 已有产品列表
  filteredSuggestions: any[] = [];
  productCode: string;
  productName = '';
  janId = '';


  dispatchMap: { [key: string]: string } = {};

  ngOnInit() {

    this.productService.getProducts().subscribe((data: any[]) => {
      this.products = data;
    });



    this.productCode =
      this.route.snapshot.paramMap.get('productId');
    // ⭐ 获取当前商品信息
    this.firestore.doc(`products/${this.productCode}`).valueChanges().subscribe((product: any) => {
      if (product) {
        this.productName = product.name || '';
        this.janId = product.janId || '';
      }
    });


    // 库存历史
    this.firestore.collection(`products/${this.productCode}/stockHistory`, ref =>
      ref.orderBy('createdAt', 'desc')
    )
      .valueChanges({ idField: 'id' })
      .subscribe(res => {
        this.history = res;
        console.log('Stock history:', res);
        this.filtered = [...res];
      });

    this.dispatchService.getDispatchs().subscribe(list => {
      list.forEach(d => {
        this.dispatchMap[d.id] = d.name;
      });
    });
  }




  applyFilter() {
    this.filtered = this.history.filter(item => {
      const keywordMatch =
        !this.keyword ||
        JSON.stringify(item).toLowerCase().includes(this.keyword.toLowerCase());

      const typeMatch = !this.filterType || item.actionType === this.filterType;

      return keywordMatch && typeMatch;
    });
  }

  getActionLabel(type: string) {
    return {
      in: '入库',
      out: '出库',
      'adjust-in': '调整入库',
      'adjust-out': '调整出库'
    }[type] || type;
  }

  //编辑暂时不添加
  editRecord(record: any) {
    // Implement edit functionality here
    console.log('Editing record:', record);
  }

  //删除功能跟在库变化冲突了暂时不添加
  deleteRecord(id: string) {
    if (
      !confirm('确定要删除这条记录吗？此操作不可撤销。')
    ) {
      return;
    }
    const productCode =
      this.route.snapshot.paramMap.get('productId');

    this.firestore
      .doc(`products/${productCode}/stockHistory/${id}`)
      .delete()
      .then(() => {
        console.log('已删除记录:', id);
      }
      )
  }


  filterSuggestions() {
    const value = this.jumpCode.toUpperCase();
    if (!value) {
      this.filteredSuggestions = [];
      return;
    }
    this.filteredSuggestions = this.products.filter(product =>
      product.code.toUpperCase().includes(value)
    ).slice(0, 5); // 限制最多显示5个建议
  }

  selectSuggestion(code: string) {
    this.jumpCode = code;
    this.filteredSuggestions = [];
    this.goToCode();
  }

  goToCode() {
    const code = this.jumpCode.trim().toUpperCase();
    if (!code) {
      return;
    }
    const exists = this.products.some(product => product.code.toUpperCase() === code);
    if (exists) {
      // 跳转到对应产品的库存历史页面
      this.router.navigate(['/stock/history/', code]).then(() => {
        this.ngOnInit();
      }
      );

    } else {
      alert('未找到对应的产品编码。');
    }
  }
}
