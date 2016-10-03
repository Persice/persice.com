import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from '../../../../common/events/events.service';
import { EventsComponent } from '../../../../common/events/events.component';
import { FilterService } from '../../../../common/services/filter.service';

@Component({
  selector: 'prs-events-list-view',
  providers: [ EventsService ],
  templateUrl: '../events-list-view/events-list.html'
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
        this.eventsType = params[ 'type' ];
        this.selectEventsType(params[ 'type' ]);

        // create new observer for filters and subscribe
        this.filterService.addObserver('events');
        this.filterService.observer('events')
          .subscribe((data) => this.loadEvents());
      });
  }

  ngOnDestroy() {
    this.filterService.observer('events').unsubscribe();
    this.filterService.removeObserver('events');

    this.onDestroy();
  }

}
