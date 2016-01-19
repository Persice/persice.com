import {Component, Input} from 'angular2/core';

import {CircleProgressDirective} from '../../directives/circleprogress.directive';
import {SwiperDirective} from '../../directives/swiper.directive';

let view = require('./profile_avatar.html');

@Component({
  selector: 'profile-avatar',
  directives: [
    CircleProgressDirective,
    SwiperDirective
  ],
  template: view
})
export class ProfileAvatarComponent {
  @Input() type;
  @Input() avatar;
  @Input() images;
  @Input() score;
  @Input() count;

  swiperOpts = JSON.stringify({
    pagination: '.js-avatar-place__pagination',
    paginationClickable: true
  });

}
