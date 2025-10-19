import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ✅ 定义接口并导出
export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
}

// ✅ 声明并导出 Service 类
@Injectable({
  providedIn: 'root'
})
export class GitHubService {

  constructor(private _http: HttpClient) {}

  getGitHubData(_searchTerm: string): Observable<{ items: GitHubUser[] }> {
    const url = `https://api.github.com/search/users?q=${_searchTerm}`;
    return this._http.get<{ items: GitHubUser[] }>(url);
  }
}
