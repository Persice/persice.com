import {Component, Input, ChangeDetectionStrategy} from 'angular2/core';
import {SlickDirective} from '../../directives/slick.directive';
import {SwiperDirective} from '../../directives/swiper.directive';

let view = require('./profile_likes.html');

@Component({
  template: view,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'profile-likes',
  directives: [SlickDirective]
})
export class ProfileLikesComponent {
  @Input() likes;
  @Input() count;

}
