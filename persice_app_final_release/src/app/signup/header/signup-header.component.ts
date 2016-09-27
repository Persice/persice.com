import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'prs-signup-header',
  templateUrl: './signup-header.html',
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
