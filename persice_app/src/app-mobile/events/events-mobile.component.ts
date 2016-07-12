import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppStateService} from '../shared/services/app-state.service';
import {EventsMobileService} from './events-mobile.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadingComponent} from '../../app/shared/components/loading/loading.component';
import {OpenLeftMenuDirective} from '../shared/directives/open-left-menu.directive';
import {Subscription, Observable} from 'rxjs';
import {Event} from '../shared/model/event';
import {EventSummaryComponent} from './event-summary';
import {EventsNotFoundMobileComponent} from './events-not-found';
import {InfiniteScrollDirective} from '../../common/directives';
import {EventMembersService} from '../../app/shared/services/eventmembers.service';
import {CookieUtil} from '../../app/shared/core/util';

@Component({
  selector: 'prs-mobile-events',
  template: <any>require('./events-mobile.html'),
  directives: [
    LoadingComponent,
    OpenLeftMenuDirective,
    EventSummaryComponent,
    EventsNotFoundMobileComponent,
    InfiniteScrollDirective
  ],
  providers: [EventsMobileService, EventMembersService]
})
export class EventsMobileComponent implements OnInit, OnDestroy {

  eventsType: EventsType;
  eventsTypeLabel: string;
  isEventsTypeDropdownVisible = false;

  private events$: Observable<Event[]>;
  private isLoading$: Observable<boolean>;
  private notFound$: Observable<boolean>;
  private isLoadingInitial$: Observable<boolean>;
  private isLoadedSub: Subscription;
  private isLoaded: boolean = false;
  private routerSub: Subscription;
  private savingRsvp: boolean = false;
  private rsvpStatus: any;
  private usernameFromCookie: string;
  private userIdFromCookie: string;

  constructor(
    private appStateService: AppStateService,
    private eventsService: EventsMobileService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.usernameFromCookie = CookieUtil.getValue('user_username');
    this.userIdFromCookie = CookieUtil.getValue('userid');
  }

  ngOnInit(): any {
    document.querySelector('html').classList.toggle('bg-gray-2');
    this.appStateService.setHeaderVisibility(false);
    this.appStateService.setFooterButtonVisibility(true);

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

  ngOnDestroy(): any {
    document.querySelector('html').classList.toggle('bg-gray-2');
    this.appStateService.setHeaderVisibility(true);
    this.appStateService.setFooterButtonVisibility(false);
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
    if (this.isLoadedSub) {
      this.isLoadedSub.unsubscribe();
    }
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

  clickHeader(): void {
    this.isEventsTypeDropdownVisible = !this.isEventsTypeDropdownVisible;
  }

  clickEventsTypeDropdownElement(type, event): void {
    event.stopPropagation();
    this._loadEvents(type, true);
    this.isEventsTypeDropdownVisible = !this.isEventsTypeDropdownVisible;
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

export type EventsType = 'all' | 'my' | 'connections';
