import {Component, Input, Output, EventEmitter} from 'angular2/core';

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
  @Input() loading;
  @Input() avatar;
  @Input() images;
  @Input() score;
  @Input() count;
  @Input() id;
  @Output() openEdit: EventEmitter<any> = new EventEmitter();

  swiperOpts = JSON.stringify({
    pagination: '.js-avatar-place__pagination',
    paginationClickable: true,
    observer: true,
    initialSlide: 0
  });

}
