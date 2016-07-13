import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Event} from '../../../shared/model/event';


@Component({
  selector: 'prs-mobile-event-rsvp',
  template: require('./event-rsvp-mobile.html')
})
export class EventRsvpMobileComponent {
  @Input() event: Event;
  @Input() username: string;
  @Input() userId: string;
  @Output() onToggleRsvpElement: EventEmitter<any> = new EventEmitter();

  private oldRsvp: any = {};

  constructor() {

  }

  ngOnInit() {
    this.oldRsvp = this.event.rsvpOfUsername(this.username);

  }
}

