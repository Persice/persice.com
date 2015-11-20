/// <reference path="../../../typings/_custom.d.ts" />

import {Component} from 'angular2/angular2';

import {EventsListComponent} from '../eventslist/eventslist.component';
import {NewEventCardComponent} from '../neweventcard/neweventcard.component';
import {EventsService} from '../../services/events.service';

@Component({
  selector: 'events-my-list',
  directives: [NewEventCardComponent, EventsListComponent],
  template: `
  <newevent-card (on-click)="openNewEventModal($event)"></newevent-card>
  <events-list [events]="events"></events-list>
  `
})
export class EventsMyListComponent {
  events: any[] = [];
  service;

  constructor(eventsService: EventsService) {
    this.service = eventsService;
  }

}
