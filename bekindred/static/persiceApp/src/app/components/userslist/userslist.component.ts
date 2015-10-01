/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive, ElementRef} from 'angular2/angular2';


import {UserCardComponent} from '../usercard/usercard.component';
let view = require('./userslist.html');

@Component({
  selector: 'users-list'
})
@View({
  directives: [UserCardComponent],
  template: view
})
export class UsersListComponent {
  constructor() {

  }
}
