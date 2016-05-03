import {Component, Input, Output, EventEmitter} from '@angular/core';

import {SwiperDirective, CheckImageDirective} from '../shared/directives';


@Component({
  selector: 'prs-profile-avatar',
  directives: [
    SwiperDirective,
    CheckImageDirective
  ],
  template: require('./avatar.html')
})
export class AvatarComponent {
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
