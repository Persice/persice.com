import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppStateService } from '../shared/services/app-state.service';
import { EventsService } from '../../common/events/events.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingComponent } from '../../app/shared/components/loading/loading.component';
import { OpenLeftMenuDirective } from '../shared/directives/open-left-menu.directive';
import { Subscription, Observable } from 'rxjs';
import { Event, EventsType } from '../shared/model/event';
import { EventSummaryComponent } from './event-summary';
import { EventsNotFoundMobileComponent } from './events-not-found';
import { InfiniteScrollDirective } from '../../common/directives';
import { EventMembersService } from '../../app/shared/services/eventmembers.service';
import { TokenUtil } from '../../common/core/util';
import { DROPDOWN_DIRECTIVES } from '../shared/directives/dropdown/index';
import { FilterMobileComponent } from '../shared/components/filter/filter-mobile.component';
import { FilterService } from '../../app/shared/services/filter.service';

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
export class EventsMobileComponent implements OnInit, OnDestroy {

  LIST_TYPE: string = 'events';
  eventsType: EventsType;
  eventsTypeLabel: string;
  filtersActive: boolean;

  private events$: Observable<Event[]>;
  private isLoading$: Observable<boolean>;
  private notFound$: Observable<boolean>;
  private isLoadingInitial$: Observable<boolean>;
  private isLoadedSub: Subscription;
  private isLoaded: boolean = false;
  private routerSub: Subscription;
  private usernameFromToken: string;
  private userIdFromToken: string;

  constructor(
    private appStateService: AppStateService,
    private eventsService: EventsService,
    protected filterService: FilterService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.usernameFromToken = TokenUtil.getValue('username');
    this.userIdFromToken = TokenUtil.getValue('user_id');
  }

  ngOnInit(): any {
    document.querySelector('html').classList.toggle('bg-gray-2');
    this.init();
  }

  ngOnDestroy(): any {
    document.querySelector('html').classList.toggle('bg-gray-2');
    this.appStateService.setHeaderVisibility(true);
    // TODO: enable add new event button
    // this.appStateService.setFooterButtonVisibility(false);
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
    if (this.isLoadedSub) {
      this.isLoadedSub.unsubscribe();
    }
  }

  init() {
    this.appStateService.setHeaderVisibility(false);
    // TODO: enable add new event button
    // this.appStateService.setFooterButtonVisibility(true);

    this.events$ = this.eventsService.events$;
    this.isLoading$ = this.eventsService.isLoading$;
    this.notFound$ = this.eventsService.notFound$;
    this.isLoadingInitial$ = this.eventsService.isLoadingInitial$;
    this.isLoadedSub = this.eventsService.isLoaded$.subscribe(
      (state: boolean) => {
        this.isLoaded = state;
      }
    );

    this.routerSub = this.route.params.subscribe(
      params => {
        this.eventsType = params['type'];
        this._loadEvents(this.eventsType, true);
      }
    );
  }

  openEvent(event: Event) {
    const eventUrl: string = `/event/${event.id}`;
    this.router.navigateByUrl(eventUrl);
  }

  selectEventsType(type) {
    this.eventsType = type;
    this._loadEvents(type, true);
  }

  public loadMoreEvents(event: MouseEvent) {
    if (!this.isLoaded) {
      this._loadEvents(this.eventsType, false);
    }
  }

  clickEventsTypeDropdownElement(type, event): void {
    event.stopPropagation();
    this._loadEvents(type, true);
    this.router.navigateByUrl(`/events/${type}`);
  }

  setEventsTypeLabel(type) {
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

  hideFilters(loadNewData: boolean) {
    this.filtersActive = false;
    this.init();
  }

  /**
   * Load events from EventsService
   * @param {EventsType} type    Type of events to show
   * @param {boolean}    initial Indicator whether loading events initially or loading more events
   */
  private _loadEvents(type: EventsType, initial: boolean) {
    if (initial) {
      this.setEventsTypeLabel(type);
      this.eventsService.loadInitial(type);
    } else {
      this.eventsService.loadMore(type);
    }

  }
}
