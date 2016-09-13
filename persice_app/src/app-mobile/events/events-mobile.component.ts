import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppStateService } from '../shared/services/app-state.service';
import { EventsService } from '../../common/events/events.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingComponent } from '../../app/shared/components/loading/loading.component';
import { OpenLeftMenuDirective } from '../shared/directives/open-left-menu.directive';
import { Event, EventsType } from '../../common/models/event/index';
import { EventSummaryComponent } from './event-summary';
import { EventsNotFoundMobileComponent } from './events-not-found';
import { InfiniteScrollDirective } from '../../common/directives';
import { EventMembersService } from '../../app/shared/services/eventmembers.service';
import { DROPDOWN_DIRECTIVES } from '../shared/directives/dropdown/index';
import { FilterMobileComponent } from '../shared/components/filter/filter-mobile.component';
import { EventsComponent } from '../../common/events/events.component';

@Component({
  selector: 'prs-mobile-events',
  template: <any>require('./events-mobile.html'),
  directives: [
    LoadingComponent,
    OpenLeftMenuDirective,
    EventSummaryComponent,
    EventsNotFoundMobileComponent,
    InfiniteScrollDirective,
    FilterMobileComponent,
    DROPDOWN_DIRECTIVES
  ],
  providers: [EventsService, EventMembersService]
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
        this.eventsType = params['type'];
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

  protected afterLoadEvents(type: EventsType): void {
    this.setEventsTypeLabel(type);
  }

  private openEvent(event: Event): void {
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
