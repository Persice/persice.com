import {Component, Input} from 'angular2/core';
import {CheckImageDirective} from "../../../../app/shared/directives";

@Component({
  selector: 'prs-mobile-user-card',
  template: require('./user-card-mobile.html'),
  directives: [CheckImageDirective]
})
export class UserCardMobileComponent {
  @Input() person;
}
