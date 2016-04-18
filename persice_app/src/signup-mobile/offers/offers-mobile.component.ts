import {Component, Output, EventEmitter} from 'angular2/core';

@Component({
  selector: 'prs-mobile-offers',
  template: require('./offers-mobile.html')
})
export class SignupOffersMobileComponent {
  @Output() counter: EventEmitter<any> = new EventEmitter();
}
