import {Component, EventEmitter, Input} from 'angular2/core';

import {EventCardComponent} from './event-card.component';

@Component({
  outputs: ['onClicked'],
  selector: 'prs-events-list',
  directives: [EventCardComponent],
  template: `
  <div class="layout__item large-1/3 extralarge-and-up-1/4" *ngFor="#event of events">
    <prs-event-card [event]="event"></prs-event-card>
  </div>
  `
})
export class EventsListComponent {
  @Input() events;
  onClicked: EventEmitter<any> = new EventEmitter();

  onItemClicked(data) {
    this.onClicked.next(data);
  }

}
