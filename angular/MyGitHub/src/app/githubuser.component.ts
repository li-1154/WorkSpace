import { Component } from "@angular/core";

import { ActivatedRoute } from "@angular/router";

@Component(
    {
        selector:'githubUser',
        template:`
            <h1>User Login:{{login}}</h1>
            <h2>User Score:{{score}}</h2>
        
        `,
    }
    
)

export class GitHubUserComponent
{
            login;
            score;

    constructor(private _route:ActivatedRoute)
    {

    }
    
ngOnInit()
{
    this._route.params.subscribe(
        parms =>
        {
            this.login = parms["login"];
            this.score = parms["score"]
        }

    )
}

}
