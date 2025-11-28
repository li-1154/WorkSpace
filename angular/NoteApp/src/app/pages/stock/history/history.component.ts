import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { DispatchService } from 'src/app/services/dispatch.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {


  constructor(private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private dispatchService: DispatchService
  ) { }


  history: any[] = [];
  filtered: any[] = [];
  keyword = '';
  filterType = '';

  dispatchMap: { [key: string]: string } = {};

  ngOnInit() {
    const productCode =
      this.route.snapshot.paramMap.get('productId');

    this.firestore.collection(`products/${productCode}/stockHistory`, ref =>
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


}
