/// <reference path="../../../typings/_custom.d.ts" />

import {Component, NgFor} from 'angular2/angular2';

import {UserCardComponent} from '../usercard/usercard.component';
let view = require('./userslist.html');

@Component({
  inputs: ['users'],
  selector: 'users-list',
  directives: [UserCardComponent, NgFor],
  template: view
})
export class UsersListComponent {
  users: Array<any>;
}
