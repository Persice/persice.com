import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CheckImageDirective } from '../../shared/directives';
import { Event } from '../../../app-mobile/shared/model/event';

@Component({
  selector: 'prs-event-card-inside',
  template: <any>require('./event-card-inside.html'),
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [CheckImageDirective]
})
export class EventCardInsideComponent {
  @Input() event: Event;
}
