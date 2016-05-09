import {Component, Input, Output, EventEmitter} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';


@Component({
  selector: 'prs-signup-header',
  template: require('./signup-header.html'),
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
