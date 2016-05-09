import {Component, OnInit, OnDestroy} from '@angular/core';

import {EventsBaseComponent} from '../events-base.component';
import {EventsListComponent} from '../events-list';
import {LoadingComponent} from '../../shared/components/loading';
import {NewEventCardComponent} from '../new-event-card';

import {EventsService, FilterService} from '../../shared/services';

@Component({
  selector: 'prs-events-network-list',
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
export class EventsNetworkListComponent extends EventsBaseComponent implements OnInit, OnDestroy {
  constructor(public service: EventsService, public filterService: FilterService) {
    super(service, filterService, 'network');
  }

  ngOnInit() {
    this.getList();
    //create new observer and subscribe
    this.filterService.addObserver(`events${this.type}`);
    this.filterService.observer(`events${this.type}`)
      .subscribe(
      (data) => this.refreshList(),
      (err) => console.log(err),
      () => console.log('event completed')
      );
  }

  ngOnDestroy() {
    this.filterService.observer(`events${this.type}`).unsubscribe();
    this.filterService.removeObserver(`events${this.type}`);
  }

}
