import { Component, Input } from "@angular/core";

@Component(
    {
        selector: 'product',
        template: `<div class="media">
            <div class="media-left">
  <img class="mr-3" src="{{data.imageUrl}}" alt="Generic placeholder image">
            </div>
  <div class="media-body">
    <h5 class="mt-0">{{data.productName}}</h5>  
    {{ data.releasedDate | date:'yyyy-MM-dd':'Asia/Tokyo' }}   
    <rating [rating] = "data.rating" 
[numOfReviews] = "data.numOfReviews">
    </rating>
     <div [ngSwitch]="data.rating">
            <div *ngSwitchCase="1">
                poor
            </div>
            <div *ngSwitchCase="2">
                Fail
            </div>
            <div *ngSwitchCase="3">
                GOod
            </div>
            <div *ngSwitchCase="4">
                Very Good
            </div>
            <div *ngSwitchCase="5">
                Excellent
            </div>
                  <div *ngSwitchDefault>
                NOT RATED
            </div>
        </div>
    <br>
        {{data.description | truncate:20}}
  </div>
</div>`,
        styles: [`
    .media{
        margin-bottom:20px;
    }
    `]
    }
)
export class ProductComponent {
    @Input() data: any;

}