import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Event } from '../../shared/model/event';
import { RsvpElementComponent } from '../../../common/events/rsvp-element/rsvp-element.component';
import { CheckImageDirective } from '../../../app/shared/directives/checkimage.directive';

@Component({
  selector: 'prs-mobile-event-summary',
  template: <any>require('./event-summary.html'),
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [RsvpElementComponent, CheckImageDirective]
})
export class EventSummaryComponent {
  @Input() event: Event;
  @Input() username: string;
  @Input() userId: string;
  @Output() onOpenEvent: EventEmitter<any> = new EventEmitter();

  isRsvpElementVisible: boolean = false;

  handleRsvpButtonVisibility(status: boolean, event) {
    if (event) {
      event.stopPropagation();
    }
    this.isRsvpElementVisible = status;
  }

}

