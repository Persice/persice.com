import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'prs-profile-avatar',
  templateUrl: './avatar.html'
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
