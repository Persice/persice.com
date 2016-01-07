import {Component, Input} from 'angular2/core';
import {SlickDirective} from '../../directives/slick.directive';

let view = require('./profile_friends.html');

@Component({
  template: view,
  selector: 'profile-friends',
  directives: [SlickDirective]
})
export class ProfileFriendsComponent {
  @Input() friends;
  @Input() count;
}
