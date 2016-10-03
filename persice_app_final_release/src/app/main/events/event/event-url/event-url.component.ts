import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Event } from '../../../../../common/models/event';

@Component({
  selector: 'prs-event-url',
  templateUrl: './event-url.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventUrlComponent {
  @Input() event: Event;

}
