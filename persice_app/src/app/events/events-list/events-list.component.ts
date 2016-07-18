import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EventCardComponent } from './event-card.component';

@Component({
  selector: 'prs-events-list',
  directives: [EventCardComponent],
  template: `
  <div class="layout__item large-1/3 extralarge-and-up-1/4" *ngFor="let event of events">
    <prs-event-card [event]="event"></prs-event-card>
  </div>
  `
})
export class EventsListComponent {
  @Input() events;
  @Output() onClicked: EventEmitter<any> = new EventEmitter();

  onItemClicked(data) {
    this.onClicked.next(data);
  }

}
