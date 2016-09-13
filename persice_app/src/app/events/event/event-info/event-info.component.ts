import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DropdownDirective } from '../../../shared/directives';
import { Event } from '../../../../common/models/event/index';
import { EventMembersService } from '../../../shared/services/eventmembers.service';
import { RsvpElementComponent } from '../../../../common/events/rsvp-element/rsvp-element.component';
import { EventUtil } from "../../../../common/core/util";

@Component({
  selector: 'prs-event-info',
  template: <any>require('./event-info.html'),
  directives: [ DropdownDirective ],
  providers: [ EventMembersService ]
})
// This component contains RSVP element
export class EventInfoComponent extends RsvpElementComponent {
  @Input() event: Event;
  @Input() username: string;
  @Input() userId: string;
  @Output() refreshEvent: EventEmitter<any> = new EventEmitter();

  constructor(protected eventMembersService: EventMembersService) {
    super(eventMembersService);
  }

  private accessLevelText(accessLevel: string): string {
    return EventUtil.accessLevel(accessLevel);
  }

  private switchRsvp(status: string): void {
    this.changeRsvpStatus(status);
    this.refreshEvent.emit(true);
  }
}
