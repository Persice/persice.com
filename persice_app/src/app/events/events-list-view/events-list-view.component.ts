import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventsComponent } from '../../../common/events/events.component';
import { LoadingComponent } from '../../shared/components/loading';
import { NewEventCardComponent } from '../new-event-card';
import { FilterService } from '../../shared/services';
import { EventCardComponent } from '../event-card/event-card.component';
import { EventsService } from '../../../common/events/events.service';
import { InfiniteScrollDirective } from '../../../common/directives/infinite-scroll.directive';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'prs-events-list-view',
  providers: [EventsService],
  directives: [
    NewEventCardComponent,
    EventCardComponent,
    LoadingComponent,
    InfiniteScrollDirective
  ],
  template: <any>require('../events-list-view/events-list.html')
})
export class EventsListViewComponent extends EventsComponent implements OnInit, OnDestroy {

  constructor(
    eventsService: EventsService,
    private filterService: FilterService,
    private route: ActivatedRoute
  ) {
    super(eventsService);
  }

  ngOnInit() {
    this.onInit();

    this.routeSub = this.route.params
      .subscribe((params: any) => {

        // assign event type and load events
        this.eventsType = params['type'];
        this.loadEvents();

        // create new observer for filters and subscribe
        this.filterService.addObserver(`events${this.eventsType}`);
        this.filterService.observer(`events${this.eventsType}`)
          .subscribe((data) => this.loadEvents());
      });
  }

  ngOnDestroy() {
    this.filterService.observer(`events${this.eventsType}`).unsubscribe();
    this.filterService.removeObserver(`events${this.eventsType}`);

    this.onDestroy();
  }

}
