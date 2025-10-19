import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

export interface GitHubUser {
    html_url: string;
    avatar_url: string;
    login: string;
    score: string
}

@Injectable()
export class GitHubService
{
    constructor(private _http:HttpClient)
    {}
    
    getGitHubDate(_searcTerm:string):Observable<{items:GitHubUser[]}>
    {
        const url = `https://api.github.com/search/users?q=${_searcTerm}`;
        return this._http.get<{items:GitHubUser[]}>(url);
    }
}

