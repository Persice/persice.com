import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'prs-mobile-signup-header',
  templateUrl: './signup-header-mobile.html'
})
export class SignupHeaderMobileComponent {
  @Input() counter;
  @Input() nextTitle;
  @Input() title;
  @Input() nextDisabled;
  @Input() showBack;
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() back: EventEmitter<any> = new EventEmitter();
}
