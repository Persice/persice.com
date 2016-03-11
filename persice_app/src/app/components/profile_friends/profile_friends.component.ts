import {Component, Input, ChangeDetectionStrategy} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {SwiperDirective} from '../../directives/swiper.directive';
import {CheckImageDirective} from '../../directives/checkimage.directive';

let view = require('./profile_friends.html');

@Component({
  template: view,
  selector: 'profile-friends',
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [SwiperDirective, ROUTER_DIRECTIVES, CheckImageDirective]
})
export class ProfileFriendsComponent {
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
