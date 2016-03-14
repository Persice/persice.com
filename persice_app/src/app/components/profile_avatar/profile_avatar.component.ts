import {Component, Input, Output, EventEmitter} from 'angular2/core';

import {SwiperDirective} from '../../directives/swiper.directive';
import {CheckImageDirective} from '../../directives/checkimage.directive';

declare var jQuery: any;
declare var Swiper: any;

let view = require('./profile_avatar.html');

@Component({
  selector: 'profile-avatar',
  directives: [
    SwiperDirective,
    CheckImageDirective
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
  @Output() openPhotos: EventEmitter<any> = new EventEmitter();
  @Output() openGallery: EventEmitter<any> = new EventEmitter();

  swiperOpts = JSON.stringify({
    pagination: '.js-avatar-place__pagination',
    paginationClickable: true,
    observer: true,
    initialSlide: 0
  });

}
