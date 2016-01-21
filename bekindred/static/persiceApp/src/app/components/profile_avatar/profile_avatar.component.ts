import {Component, Input} from 'angular2/core';

import {CircleProgressDirective} from '../../directives/circleprogress.directive';
import {SwiperDirective} from '../../directives/swiper.directive';

declare var jQuery: any;
declare var Swiper: any;

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
  @Input() id;

  swiperOpts = JSON.stringify({
    pagination: '.js-avatar-place__pagination',
    paginationClickable: true,
    observer: true,
    initialSlide: 0
  });

}
