import {Component, Input, Output, EventEmitter} from '@angular/core';
import {DropdownDirective} from '../../shared/directives';


@Component({
  selector: 'prs-event-info',
  template: require('./event-info.html'),
  directives: [DropdownDirective]
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

}
