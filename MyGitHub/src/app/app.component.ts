import { Component } from '@angular/core';
import { GitHubService } from './github.service';
import { GitHubUser } from './github.service';

@Component({
  selector: 'app-root',
  template: `
  <h3>GitHub User</h3>
        <div>
            <i class="fa-solid fa-spinner fa-spin fa-5xs " style="color: #000000ff;"></i>

        </div>
        <div *ngFor="let user of users" class="media">
          
              <div class="media-left">
                <a href="{{user.html_url}}">
                  <img class="media-object" src="{{user.avatar_url}}" alt="...">
                </a>
              </div>
              <div class="media-body">
                <h4 class="media-heading">{{user.login}}</h4>
                score: {{user.score}}
              </div>
            </div>
       `, 
  styleUrls: ['./app.component.css'],
  providers: [GitHubService]
})
export class AppComponent {
  isloading = true;

  users:GitHubUser[] = [];
  constructor(private _ghtHubService: GitHubService) {
  }
  ngOnInit() {
    this._ghtHubService.getGitHubDate('grep').subscribe(
      data => {
        console.log('✅ 收到数据:', data);
        this.isloading = false;
        this.users=data.items;
      });
  }
}

