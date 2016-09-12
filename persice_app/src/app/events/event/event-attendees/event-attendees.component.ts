import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SwiperDirective, CheckImageDirective } from '../../../shared/directives';

@Component({
  template: <any>require('./event-attendees.html'),
  selector: 'prs-event-attendees',
  directives: [SwiperDirective, CheckImageDirective]
})
export class EventAttendeesComponent {
  @Input() people: any[];
  swiperOptions = JSON.stringify({
    slidesPerView: 9,
    spaceBetween: 5,
    nextButton: '.js-slide-users__next-1',
    prevButton: '.js-slide-users__prev-1',
    breakpoints: {
      1480: {
        slidesPerView: 6,
        spaceBetween: 5
      }
    },
    lazyLoading: true
  });

  constructor(private _router: Router) { }

  openProfile(username) {
    this._router.navigateByUrl('/' + username);
  }

}
