import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {Event} from '../../shared/model/event';
import {RsvpElementComponent} from '../rsvp-element/rsvp-element.component';

@Component({
  selector: 'prs-mobile-event-summary',
  template: <any>require('./event-summary.html'),
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [RsvpElementComponent]
})
export class EventSummaryComponent {
  @Input() event: Event;
  @Output() onOpenEvent: EventEmitter<any> = new EventEmitter();

  isRsvpElementVisible: boolean = false;

  handleRsvpButtonVisibility(status: boolean, event) {
    if (event) {
      event.stopPropagation();
    }
    this.isRsvpElementVisible = status;
  }

}

