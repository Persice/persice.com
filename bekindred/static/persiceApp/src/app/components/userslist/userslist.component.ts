import {Component, EventEmitter} from 'angular2/core';

import {UserCardComponent} from '../usercard/usercard.component';
let view = require('./userslist.html');

@Component({
  inputs: ['users'],
  outputs: ['onClicked'],
  selector: 'users-list',
  directives: [UserCardComponent],
  template: view
})
export class UsersListComponent {
  users: Array<any>;
  onClicked: EventEmitter<any> = new EventEmitter();

  onUserClicked(data) {
    this.onClicked.next(data);
  }
}
