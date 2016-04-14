import {Component, Output, EventEmitter} from 'angular2/core';

@Component({
  selector: 'prs-mobile-goals',
  template: require('./goals-mobile.html')
})
export class SignupGoalsMobileComponent {
  @Output() counter: EventEmitter<any> = new EventEmitter();
}
