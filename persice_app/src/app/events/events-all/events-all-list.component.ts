import {Component} from 'angular2/core';


import {EventsBaseComponent} from '../events-base.component';
import {EventsListComponent} from '../events-list';
import {LoadingComponent} from '../../shared/components/loading';
import {NewEventCardComponent} from '../new-event-card';

import {EventsService, FilterService} from '../../shared/services';
declare var jQuery: any;

@Component({
  selector: 'prs-events-all-list',
  providers: [EventsService],
  directives: [
    NewEventCardComponent,
    EventsListComponent,
    LoadingComponent
  ],
  template: `
    <prs-new-event-card *ngIf="!loading" (on-click)="openNewEventModal($event)"></prs-new-event-card>
    <prs-events-list [events]="items"></prs-events-list>
    <prs-loading [status]="loading"></prs-loading>
  `
})
export class EventsAllListComponent extends EventsBaseComponent {
  constructor(public service: EventsService, public filterService: FilterService) {
    super(service, filterService, 'all');
  }

}
