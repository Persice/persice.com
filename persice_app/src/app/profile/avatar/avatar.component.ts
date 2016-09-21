import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SwiperDirective } from '../../shared/directives/swiper.directive';
import { CheckImageDirective } from '../../shared/directives/checkimage.directive';

@Component({
  selector: 'prs-profile-avatar',
  directives: [
    SwiperDirective,
    CheckImageDirective
  ],
  template: <any>require('./avatar.html')
})
export class AvatarComponent {
  @Input() type: string;
  @Input() loading: boolean;
  @Input() avatar: string = '';
  @Input() images: any[];
  @Input() score: number;
  @Output() openPhotos: EventEmitter<any> = new EventEmitter();
  @Output() openGallery: EventEmitter<any> = new EventEmitter();

  private swiperOpts = JSON.stringify({
    pagination: '.js-avatar-place__pagination',
    paginationClickable: true,
    observer: true,
    initialSlide: 0
  });
}
