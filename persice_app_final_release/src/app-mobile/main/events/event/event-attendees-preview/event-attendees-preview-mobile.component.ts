import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Event } from '../../../../../common/models/event/index'

const MAX_ATTENDEES: number = 5;

@Component({
  selector: 'prs-mobile-event-attendees-preview',
  templateUrl: './event-attendees-preview-mobile.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventAttendeesPreviewMobileComponent {
  @Input() set event(data: Event) {
    this.attendees = data.attendeesPreview;
    this.spotsRemaining = data.spotsRemaining;
    this.attendeesGoingCount = data.attendeesGoing.length;

    // Fill array for displaying empty places
    const length: number = MAX_ATTENDEES - 1 - this.attendees.length;
    this.emptyPlacesArray = Array(length).fill(1).map((x, i) => i);
  };

  @Output() onClick: EventEmitter<any> = new EventEmitter();

  public attendees: any[] = [];
  public emptyPlacesArray: any[];

  public spotsRemaining: number;
  public attendeesGoingCount: number;

  public openAttendees(event: MouseEvent) {
    if (this.attendees.length > 0) {
      this.onClick.emit(event);
    }
  }

}

