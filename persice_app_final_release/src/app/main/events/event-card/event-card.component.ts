import { Component, Input } from '@angular/core';
import { Event } from '../../../../common/models/event';

@Component({
  selector: 'prs-event-card',
  templateUrl: './event-card.html',
})
export class EventCardComponent {
  @Input() event: Event;
  @Input() username: string;
  @Input() userId: string;
}
