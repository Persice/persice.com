/// <reference path="../../../typings/_custom.d.ts" />

import {Component, NgFor, EventEmitter} from 'angular2/angular2';

import {UserCardComponent} from '../usercard/usercard.component';
let view = require('./userslist.html');

@Component({
  inputs: ['users'],
  outputs: ['onClicked'],
  selector: 'users-list',
  directives: [UserCardComponent, NgFor],
  template: view
})
export class UsersListComponent {
  users: Array<any>;
  onClicked: EventEmitter = new EventEmitter();

  onUserClicked(data) {
    this.onClicked.next(data);
  }
}
