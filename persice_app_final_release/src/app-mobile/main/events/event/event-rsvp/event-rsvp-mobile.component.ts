import { Component, Input, OnInit } from '@angular/core';
import { Event } from '../../../../../common/models/event';
import { EventMembersService } from '../../../../../common/services/eventmembers.service';
import { RsvpComponent } from '../../../../../common/events/rsvp.component';

@Component({
  selector: 'prs-mobile-event-rsvp',
  templateUrl: './event-rsvp-mobile.html',
  providers: [ EventMembersService ]
})
export class EventRsvpMobileComponent extends RsvpComponent implements OnInit {
  @Input() event: Event;
  @Input() username: string;
  @Input() userId: string;

  constructor(protected eventMembersService: EventMembersService) {
    super(eventMembersService);
  }

  ngOnInit() {
    this.onInit();
  }
}
