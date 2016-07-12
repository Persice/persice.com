import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {CheckImageDirective} from '../../../../app/shared/directives';
import {Event} from '../../../shared/model/event';
const MAX_ATTENDEES: number = 5;

@Component({
  selector: 'prs-mobile-event-attendees-preview',
  template: <any>require('./event-attendees-preview-mobile.html'),
  directives: [CheckImageDirective],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventAttendeesPreviewMobileComponent {
  @Input() set event(data: Event) {
    this.attendees = data.attendeesPreview;
    this.score = data.similarity;
    this.spotsRemaining = data.spotsRemaining;
    this.connectionsAttendeesCount = data.connectionsAttendeesCount;

    // Fill array for displaying empty places
    const length: number = MAX_ATTENDEES - 1 - this.attendees.length;
    this.emptyPlacesArray = Array(length).fill(1).map((x, i) => i);
  };

  @Output() onClick: EventEmitter<any> = new EventEmitter();

  public attendees: any[] = [];
  public emptyPlacesArray: any[];
  public score: string;
  public spotsRemaining: number;
  public connectionsAttendeesCount: number;

  public openAttendees(event: MouseEvent) {
    if (this.attendees.length > 0) {
      this.onClick.emit(event);
    }
  }

}

