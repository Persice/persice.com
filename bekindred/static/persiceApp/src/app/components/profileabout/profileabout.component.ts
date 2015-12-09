import {
  Component,
  Input,
  Output,
  EventEmitter,
  NgFor,
  NgStyle,
  NgIf
} from 'angular2/angular2';

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
  NgFor,
  NgStyle,
  NgIf,
  SlickDirective
  ]
})
export class ProfileAboutComponent {
  @Input() about;
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
    this.passEvent.next(true);
  }

  acceptUser(event) {
    this.acceptEvent.next(true);
  }

  closeProfile(event) {
    this.closeprofileEvent.next(event);
  }
}
