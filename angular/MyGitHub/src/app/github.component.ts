import { Component } from '@angular/core';
import { GitHubService } from './github.service';
import { GitHubUser } from './github.service';
import { FormControl } from '@angular/forms';
import { filter,debounceTime,distinctUntilChanged}   from 'rxjs/operators'


@Component({
  selector: 'app-root',
  template: `
  <input class="form-control" type="search" [formControl] = "searchControl">
  <h3>GitHub User</h3>
        <div *ngIf="isloading">
            <i class="fa-solid fa-spinner fa-spin fa-5xs " style="color: #000000ff;"></i>

        </div>
        <div *ngFor="let user of users" class="media">
          
              <div class="media-left">
                <a href="{{user.html_url}}">
                  <img class="media-object img" src="{{user.avatar_url}}" alt="...">
                </a>
              </div>
              <div class="media-body">
                <h4 class="media-heading">{{user.login}}</h4>
                score: {{user.score}}
              </div>
            </div>
       `,
styles: [`
  .img {
    position: relative;
    float: left;
    width: 100px;
    height: 100px;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: cover;
  }
`]

})
export class GitHubComponent {
  isloading = false;
  searchControl = new FormControl();
  users: GitHubUser[] = [];

  constructor(private _ghtHubService: GitHubService) {
  }
  ngOnInit() {
   
    this.searchControl.valueChanges.pipe(
      filter(text =>text .length >=3),debounceTime(400),distinctUntilChanged())
    .subscribe(value=>{
      this.isloading = true;
      this._ghtHubService.getGitHubData(value).subscribe(
        data => {
          console.log('✅ 收到数据:', data);
          this.isloading= false;
          this.users = data.items;
        });
    })



  }
}
