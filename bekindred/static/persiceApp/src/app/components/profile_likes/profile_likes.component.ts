import {Component, Input, ChangeDetectionStrategy} from 'angular2/core';
import {SwiperDirective} from '../../directives/swiper.directive';

let view = require('./profile_likes.html');

@Component({
  template: view,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'profile-likes',
  directives: [SwiperDirective]
})
export class ProfileLikesComponent {
  @Input() likes;
  @Input() count;

  swiperOptions = JSON.stringify({
    slidesPerView: 3,
    spaceBetween: 5,
    nextButton: '.js-slide-users__next-2',
    prevButton: '.js-slide-users__prev-2',
    breakpoints: {
      1480: {
        slidesPerView: 2,
        spaceBetween: 5
      }
    },
    observer: true,
    initialSlide: 0
  });
}
