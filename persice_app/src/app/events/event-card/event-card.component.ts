import { Component, Input } from '@angular/core';
import { Event } from '../../../app-mobile/shared/model/event';
import { EventCardInsideComponent } from './event-card-inside.component';
import { RsvpElementComponent } from '../../../common/events/rsvp-element/rsvp-element.component';

@Component({
  selector: 'prs-event-card',
  template: <any>require('./event-card.html'),
  directives: [EventCardInsideComponent, RsvpElementComponent]
})
export class EventCardComponent {
  @Input() event: Event;
  @Input() username;
  @Input() userId;
}
