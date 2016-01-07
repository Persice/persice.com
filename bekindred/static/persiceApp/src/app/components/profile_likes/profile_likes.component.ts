import {Component, Input} from 'angular2/core';
import {SlickDirective} from '../../directives/slick.directive';

let view = require('./profile_likes.html');

@Component({
  template: view,
  selector: 'profile-likes',
  directives: [SlickDirective]
})
export class ProfileLikesComponent {
  @Input() likes;
  @Input() count;

}
