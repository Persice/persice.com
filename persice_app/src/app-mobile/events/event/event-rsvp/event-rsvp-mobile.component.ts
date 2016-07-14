import {Component, Input} from '@angular/core';
import {Event} from '../../../shared/model/event';
import {RsvpElementComponent} from '../../rsvp-element/rsvp-element.component';
import {EventMembersService} from '../../../../app/shared/services/eventmembers.service';


@Component({
  selector: 'prs-mobile-event-rsvp',
  template: require('./event-rsvp-mobile.html'),
  providers: [EventMembersService]
})
export class EventRsvpMobileComponent extends RsvpElementComponent {
  @Input() event: Event;
  @Input() username: string;
  @Input() userId: string;

  constructor(protected eventMembersService: EventMembersService) {
    super(eventMembersService);
  }
}

