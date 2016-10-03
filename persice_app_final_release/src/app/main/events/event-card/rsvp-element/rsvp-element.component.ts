import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { EventMembersService } from '../../../../../common/services/eventmembers.service';
import { RsvpComponent } from '../../../../../common/events/rsvp.component';
import { Event } from '../../../../../common/models/event';

@Component({
  selector: 'prs-rsvp-element',
  templateUrl: 'rsvp-element.html',
  providers: [ EventMembersService ]
})
export class RsvpElementComponent extends RsvpComponent implements OnInit {
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

