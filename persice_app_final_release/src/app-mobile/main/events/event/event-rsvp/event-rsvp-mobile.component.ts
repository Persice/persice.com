import { Component, Input } from '@angular/core';
import { Event } from '../../../../../common/models/event/index';
import { EventMembersService } from '../../../../../common/services/eventmembers.service';
import { RsvpElementComponent } from '../../../../../common/events/rsvp-element/rsvp-element.component';

@Component({
  selector: 'prs-mobile-event-rsvp',
  templateUrl: './event-rsvp-mobile.html',
  providers: [ EventMembersService ]
})
export class EventRsvpMobileComponent extends RsvpElementComponent {
  @Input() event: Event;
  @Input() username: string;
  @Input() userId: string;

  constructor(protected eventMembersService: EventMembersService) {
    super(eventMembersService);
  }
}
