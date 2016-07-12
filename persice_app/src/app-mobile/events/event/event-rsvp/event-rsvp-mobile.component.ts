import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'prs-mobile-event-rsvp',
  template: require('./event-rsvp-mobile.html')
})
export class EventRsvpMobileComponent {
  @Input() event: Event;
  @Output() onToggleRsvpElement: EventEmitter<any> = new EventEmitter();
}

