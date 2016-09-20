import { Component, Input } from '@angular/core';
import { Event } from '../../../common/models/event/event';
import { EventCardInsideComponent } from './event-card-inside.component';
import { RsvpElementComponent } from '../../../common/events/rsvp-element/rsvp-element.component';

@Component({
  selector: 'prs-event-card',
  template: <any>require('./event-card.html'),
  directives: [EventCardInsideComponent, RsvpElementComponent]
})
export class EventCardComponent {
  @Input() event: Event;
  @Input() username: string;
  @Input() userId: string;
}
