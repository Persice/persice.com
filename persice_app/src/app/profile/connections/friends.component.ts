import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { SwiperDirective } from '../../shared/directives/swiper.directive';
import { CheckImageDirective } from '../../shared/directives/checkimage.directive';

@Component({
  template: <any>require('./friends.html'),
  selector: 'prs-profile-friends',
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [SwiperDirective, ROUTER_DIRECTIVES, CheckImageDirective]
})
export class FriendsComponent {
  @Input() title: string;
  @Input() friends: any[];

  private swiperOptions = JSON.stringify({
    slidesPerView: 6,
    spaceBetween: 5,
    nextButton: '.js-slide-users__next-3',
    prevButton: '.js-slide-users__prev-3',
    breakpoints: {
      1550: {
        slidesPerView: 4,
        spaceBetween: 5
      }
    }
  });
}
