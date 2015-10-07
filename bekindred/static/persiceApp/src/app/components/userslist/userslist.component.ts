/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive, NgFor} from 'angular2/angular2';
import {Http, Headers, HTTP_BINDINGS} from 'angular2/http';

import {UserCardComponent} from '../usercard/usercard.component';
let view = require('./userslist.html');

@Component({
  inputs: ['users'],
  selector: 'users-list'
})
@View({
  directives: [UserCardComponent, NgFor],
  template: view
})
export class UsersListComponent {
  users: Array<any>;
  constructor(public http: Http) {

  }

  onInit() {
  }

}
