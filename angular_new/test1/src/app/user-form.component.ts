import { Component } from "@angular/core";
import { User } from "./User";
import { timeout, timestamp } from "rxjs";

@Component(
    {
        selector: 'user-from',
        templateUrl: './user-form.component.html'
    }
)

export class UserFromComponent {


    model = new User('', '', '');
    countries = ['Japan', 'China', 'South Korea', 'North Korea', 'Taiwan', 'Hong Kong',
        'India', 'Thailand', 'Vietnam', 'Malaysia', 'Singapore', 'Indonesia', 'Philippines',
        'United Kingdom', 'France', 'Germany', 'Italy', 'Spain', 'Russia', 'Netherlands',
        'Switzerland', 'Sweden', 'Norway', 'United States', 'Canada', 'Mexico', 'Brazil',
        'Argentina', 'Chile', 'Egypt', 'South Africa', 'Kenya', 'Nigeria', 'Morocco',
        'Australia', 'New Zealand', 'Fiji'];
    information: String = 'check is loading..........';
    onSubmit() {
        this.information = "submint is click!!! check is over";
    }
}