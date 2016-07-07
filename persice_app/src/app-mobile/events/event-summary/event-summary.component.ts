import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {Event} from '../../shared/model/event';

@Component({
  selector: 'prs-mobile-event-summary',
  template: <any>require('./event-summary.html'),
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventSummaryComponent {
  @Input() event: Event;
  @Output() onOpenEvent: EventEmitter<any> = new EventEmitter();

}

