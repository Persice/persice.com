import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from '../../../common/events/events.service';
import { EventMembersService } from '../../../common/services/eventmembers.service';
import { EventsComponent } from '../../../common/events/events.component';
import { EventsType } from '../../../common/models/event/event';
import { Event } from '../../../common/models/event/index';
import { AppStateService } from '../../shared/services/app-state.service';

@Component({
  selector: 'prs-mobile-events',
  templateUrl: './events-mobile.html',
  providers: [ EventsService, EventMembersService ]
})
export class EventsMobileComponent extends EventsComponent implements OnInit, OnDestroy {

  constructor(
    eventsService: EventsService,
    private appStateService: AppStateService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super(eventsService);
  }

  ngOnInit(): any {
    this.onInit();
    document.querySelector('html').classList.toggle('bg-gray-2');
    this.appStateService.setHeaderVisibility(false);
    // TODO: enable add new event button
    // this.appStateService.setFooterButtonVisibility(true);
    this.routeSub = this.route.params.subscribe(
      params => {
        this.eventsType = params[ 'type' ];
        this.loadEvents();
      }
    );
  }

  ngOnDestroy(): any {
    document.querySelector('html').classList.toggle('bg-gray-2');
    this.appStateService.setHeaderVisibility(true);
    // TODO: enable add new event button
    // this.appStateService.setFooterButtonVisibility(false);

    this.onDestroy();
  }

  afterLoadEvents(type: EventsType): void {
    this.setEventsTypeLabel(type);
  }

  private openEvent(event: any): void {
    const eventUrl: string = `/event/${event.id}`;
    this.router.navigateByUrl(eventUrl);
  }

  private clickEventsTypeDropdownElement(type: string, event: MouseEvent): void {
    event.stopPropagation();
    this.router.navigateByUrl(`/events/${type}/list`);
  }

  private setEventsTypeLabel(type): void {
    if (type === 'all') {
      this.eventsTypeLabel = 'All events';
    }
    if (type === 'my') {
      this.eventsTypeLabel = 'My events';
    }
    if (type === 'connections') {
      this.eventsTypeLabel = 'My network';
    }
  }

  private hideFilters(): void {
    this.filtersActive = false;
    this.loadEvents();
  }
}
