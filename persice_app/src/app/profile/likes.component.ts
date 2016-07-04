import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {SwiperDirective} from '../shared/directives';

@Component({
  template: <any>require('./likes.html'),
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'prs-profile-likes',
  directives: [SwiperDirective]
})
export class LikesComponent {
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
    }
  });
}
