import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { EventMembersService } from '../../../../../common/services/eventmembers.service';
import { EventUtil } from '../../../../../common/core';
import { Event } from '../../../../../common/models/event';
import { RsvpComponent } from '../../../../../common/events/rsvp.component';

@Component({
  selector: 'prs-event-info',
  templateUrl: './event-info.html',
  providers: [ EventMembersService ]
})
// This component contains RSVP element
export class EventInfoComponent extends RsvpComponent implements OnInit {
  @Input() event: Event;
  @Input() username: string;
  @Input() userId: string;
  @Output() refreshEvent: EventEmitter<any> = new EventEmitter();
  @Output() onOpenEdit: EventEmitter<any> = new EventEmitter();

  constructor(protected eventMembersService: EventMembersService) {
    super(eventMembersService);
  }

  ngOnInit() {
    this.onInit();
  }

  accessLevelText(accessLevel: string): string {
    return EventUtil.accessLevel(accessLevel);
  }

  switchRsvp(status: string): void {
    this.changeRsvpStatus(status);
    this.refreshEvent.emit(true);
  }
}
