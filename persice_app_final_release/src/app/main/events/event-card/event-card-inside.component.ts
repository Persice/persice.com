import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Event } from '../../../../common/models/event/event';

@Component({
  selector: 'prs-event-card-inside',
  templateUrl: './event-card-inside.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventCardInsideComponent {
  @Input() event: Event;
}
