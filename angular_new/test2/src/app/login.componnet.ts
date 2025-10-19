import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators, FormBuilder } from "@angular/forms";
import { PasswordValidator } from "./passwordValidator";
import { LoginService } from "./login.service";

@Component(
    {
        selector: 'login',
        templateUrl: './login.Component.html',
        styleUrls: ['./login.component.css']
    }
)

export class loginComponent {
    form: FormGroup;
    constructor(fb: FormBuilder, private _loginService: LoginService) {
        this.form = fb.group({

            username: ['', Validators.required],
            password: ['', [Validators.required,
            PasswordValidator.cannotContainSpace
            ]]
        });
    }

    // Message: string = 'please input your username and password';
    login() {
        var result = this._loginService.login(
            this.form.controls['username'].value,
            this.form.controls['password'].value
        )
        if (!result) {
            // this.Message = 'Password or usename is error';
            this.form.controls['password'].setErrors({
                invalidLogin:true
            })
        }
        // else {
        //     this.Message = 'Password or usename is ok!!!';
        // }
    }

    //FormGroup 实现方法
    // form = new FormGroup(

    //     {
    //         username: new FormControl('', Validators.required),
    //         password: new FormControl('', Validators.required)
    //     }
    // )

};