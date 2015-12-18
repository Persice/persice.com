import {Component, EventEmitter, Input, Output} from 'angular2/core';

import {UserCardComponent} from '../usercard/usercard.component';
let view = require('./userslist.html');

@Component({
  inputs: ['users'],
  selector: 'users-list',
  directives: [UserCardComponent],
  template: view
})
export class UsersListComponent {
  @Input() showButtons;
  @Output() onClicked: EventEmitter<any> = new EventEmitter;
  @Output() passEvent: EventEmitter<any> = new EventEmitter;
  @Output() acceptEvent: EventEmitter<any> = new EventEmitter;

  users: Array<any>;

  passUser(event) {
    this.passEvent.next(event);
  }

  acceptUser(event) {
    this.acceptEvent.next(event);
  }


  onUserClicked(data) {
    this.onClicked.next(data);
  }
}
