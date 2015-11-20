/// <reference path="../../../typings/_custom.d.ts" />

import {Component, NgFor, EventEmitter} from 'angular2/angular2';

import {EventCardComponent} from '../eventcard/eventcard.component';

@Component({
  inputs: ['events'],
  outputs: ['onClicked'],
  selector: 'events-list',
  directives: [EventCardComponent, NgFor],
  template: `
    events-list
  `
})
export class EventsListComponent {
  events: Array<any>;
  onClicked: EventEmitter<any> = new EventEmitter();

  onItemClicked(data) {
    this.onClicked.next(data);
  }
}
