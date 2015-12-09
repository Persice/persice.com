import {Component, Input, Output, NgIf, NgClass, EventEmitter} from 'angular2/angular2';
import {DropdownDirective} from '../../directives/dropdown.directive';

let view = require('./eventinfo.html');

@Component({
  selector: 'event-info',
  template: view,
  directives: [DropdownDirective, NgIf, NgClass]
})
export class EventInfoComponent {
  @Input() info;
  @Input() host;
  @Input() rsvp;
  @Output() changeRsvp: EventEmitter<any> = new EventEmitter;
  @Output() openEdit: EventEmitter<any> = new EventEmitter;

  changeRsvpStatus(event) {
    //change rsvp status if different from previous status
    if (this.rsvp !== event) {
      this.changeRsvp.next(event);
    }
  }

  openEditEvent(event) {
    console.log('open edit');
  }
}
