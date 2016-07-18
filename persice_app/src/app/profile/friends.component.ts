import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { SwiperDirective, CheckImageDirective } from '../shared/directives';

@Component({
  template: <any>require('./friends.html'),
  selector: 'prs-profile-friends',
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [SwiperDirective, ROUTER_DIRECTIVES, CheckImageDirective]
})
export class FriendsComponent {
  @Input() title;
  @Input() type;
  @Input() friends;
  @Input() count;
  swiperOptions = JSON.stringify({
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
