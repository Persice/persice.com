import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Event } from '../../../../common/models/event/index';

@Component({
  selector: 'prs-mobile-event-summary',
  templateUrl: './event-summary.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventSummaryComponent {
  @Input() event: Event;
  @Input() username: string;
  @Input() userId: string;
  @Output() onOpenEvent: EventEmitter<any> = new EventEmitter();

  isRsvpElementVisible: boolean = false;

  handleRsvpButtonVisibility(status: boolean, event: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    this.isRsvpElementVisible = status;
  }

}

