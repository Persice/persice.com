import {Component, Input, ChangeDetectionStrategy} from 'angular2/core';
import {SlickDirective} from '../../directives/slick.directive';

let view = require('./profile_friends.html');

@Component({
  template: view,
  selector: 'profile-friends',
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [SlickDirective]
})
export class ProfileFriendsComponent {
  @Input() title;
  @Input() type;
  @Input() friends;
  @Input() count;
}
