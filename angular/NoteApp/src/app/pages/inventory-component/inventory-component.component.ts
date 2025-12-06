import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inventory-component',
  templateUrl: './inventory-component.component.html',
  styleUrls: ['./inventory-component.component.css']
})
export class InventoryComponentComponent implements OnInit {

  constructor() { }

  currentTab: 'products' | 'stock' | 'sales' = 'products';
  ngOnInit(): void {
  }

}
