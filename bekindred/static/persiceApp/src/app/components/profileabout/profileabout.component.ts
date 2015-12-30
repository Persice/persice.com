import {
  Component,
  Input,
  Output,
  EventEmitter,
} from 'angular2/core';

import {GenderPipe} from '../../pipes/gender.pipe';
import {CircleProgressDirective} from '../../directives/circleprogress.directive';
import {SlickDirective} from '../../directives/slick.directive';

declare var jQuery: any;


let view = require('./profileabout.html');
@Component({
  template: view,
  selector: 'profile-about',
  pipes: [GenderPipe],
  directives: [
  CircleProgressDirective,
  SlickDirective
  ]
})
export class ProfileAboutComponent {
  @Input() about;
  @Input() userId;
  @Input() images;
  @Input() avatar;
  @Input() name;
  @Input() age;
  @Input() distanceValue;
  @Input() distanceUnit;
  @Input() gender;
  @Input() score;
  @Output() acceptEvent: EventEmitter<any> = new EventEmitter;
  @Output() passEvent: EventEmitter<any> = new EventEmitter;
  @Output() closeprofileEvent: EventEmitter<any> = new EventEmitter;

  passUser(event) {
    this.passEvent.next(this.userId);
  }

  acceptUser(event) {
    this.acceptEvent.next(this.userId);
  }

  closeProfile(event) {
    this.closeprofileEvent.next(event);
  }
}
