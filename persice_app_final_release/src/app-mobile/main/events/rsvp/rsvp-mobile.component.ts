import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { RsvpComponent } from '../../../../common/events/rsvp.component';
import { EventMembersService } from '../../../../common/services/eventmembers.service';
import { Event } from '../../../../common/models/event';

@Component({
  selector: 'prs-rsvp-element',
  templateUrl: './rsvp-mobile.component.html',
  providers: [ EventMembersService ]
})
export class RsvpMobileComponent extends RsvpComponent implements OnInit {
  @Input() event: Event;
  @Input() username: string;
  @Input() userId: string;
  @Output() onToggleRsvpElement: EventEmitter<any> = new EventEmitter();

  constructor(protected eventMembersService: EventMembersService) {
    super(eventMembersService);
  }

  ngOnInit() {
    this.onInit();
  }
}

