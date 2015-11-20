/// <reference path="../../../typings/_custom.d.ts" />

import {Component} from 'angular2/angular2';

import {EventsListComponent} from '../eventslist/eventslist.component';
import {NewEventCardComponent} from '../neweventcard/neweventcard.component';

@Component({
  selector: 'events-all-list',
  directives: [NewEventCardComponent, EventsListComponent],
  template: `
  <newevent-card (on-click)="openNewEventModal($event)"></newevent-card>
  <events-list [events]="events"></events-list>
  `
})
export class EventsAllListComponent {
  events: any[] = [];

}
