import {Component, NgFor, EventEmitter} from 'angular2/angular2';

import {EventCardComponent} from '../eventcard/eventcard.component';
declare var jQuery: any;

@Component({
  inputs: ['events'],
  outputs: ['onClicked'],
  selector: 'events-list',
  directives: [EventCardComponent, NgFor],
  template: `
  <div class="layout__item large-1/3 extralarge-and-up-1/4" *ngFor="#event of events">
    <event-card [event]="event"></event-card>
  </div>
  `
})
export class EventsListComponent {
  events: Array<any>;
  onClicked: EventEmitter<any> = new EventEmitter();

  onItemClicked(data) {
    this.onClicked.next(data);
  }

}
