import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

let view = require('./signup_header.html');

@Component({
  selector: 'signup-header',
  template: view,
  directives: [ROUTER_DIRECTIVES]
})
export class SignupHeaderComponent {
  @Input() counterInterests;
  @Input() counterGoals;
  @Input() counterOffers;
  @Input() page;
  @Input() nextTitle;
  @Input() showSkip;
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() skip: EventEmitter<any> = new EventEmitter();
}
