import { Component, Input } from '@angular/core';
import { Event } from '../../../app-mobile/shared/model/event';
import { EventCardInsideComponent } from './event-card-inside.component';

@Component({
  selector: 'prs-event-card',
  template: <any>require('./event-card.html'),
  directives: [EventCardInsideComponent]
})
export class EventCardComponent {
  @Input() event: Event;
  @Input() username;
  @Input() userId;
}
