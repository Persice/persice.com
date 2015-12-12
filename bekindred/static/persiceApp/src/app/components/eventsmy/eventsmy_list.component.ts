import {Component, NgIf} from 'angular2/angular2';

import {EventsBaseComponent} from '../events/events_base.component';
import {EventsListComponent} from '../eventslist/eventslist.component';
import {LoadingComponent} from '../loading/loading.component';
import {NewEventCardComponent} from '../neweventcard/neweventcard.component';
import {EventsService} from '../../services/events.service';
import {FilterService} from '../../services/filter.service';

declare var jQuery: any;

@Component({
  selector: 'events-my-list',
  providers: [EventsService],
  directives: [
    NgIf,
    NewEventCardComponent,
    EventsListComponent,
    LoadingComponent
  ],
  template: `
  <newevent-card *ngIf="!loading" (on-click)="openNewEventModal($event)"></newevent-card>
  <events-list [events]="items"></events-list>
  <loading [status]="loading"></loading>
  `
})
export class EventsMyListComponent extends EventsBaseComponent {
  constructor(public service: EventsService, public filterService: FilterService) {
    super(service, filterService, 'my');
  }

}
