import { TokenUtil } from '../../common/core/util';
import { EventsService } from './events.service';
import { EventsType, Event } from '../models/event/index';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

export abstract class EventsComponent {

  LIST_TYPE: string = 'events';
  eventsType: EventsType;
  eventsTypeLabel: string;
  filtersActive: boolean;

  events$: Observable<Event[]>;
  isLoading$: Observable<boolean>;
  notFound$: Observable<boolean>;
  isLoadingInitial$: Observable<boolean>;
  isLoadedSub: Subscription;
  isLoaded: boolean = false;
  routeSub: Subscription;
  username: string;
  userId: string;

  constructor(
    protected eventsService: EventsService
  ) {
    this.username = TokenUtil.getValue('username');
    this.userId = TokenUtil.getValue('user_id');
  }

  onInit(): void {
    this.events$ = this.eventsService.events$;
    this.isLoading$ = this.eventsService.isLoading$;
    this.notFound$ = this.eventsService.notFound$;
    this.isLoadingInitial$ = this.eventsService.isLoadingInitial$;
    this.isLoadedSub = this.eventsService.isLoaded$.subscribe(
      (state: boolean) => {
        this.isLoaded = state;
      }
    );

  }

  onDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
    if (this.isLoadedSub) {
      this.isLoadedSub.unsubscribe();
    }
  }

  afterLoadEvents(type: EventsType): void { }

  selectEventsType(type: EventsType): void {
    this.eventsType = type;
    this._loadEvents(type, true);
  }

  loadEvents(): void {
    this._loadEvents(this.eventsType, true);
  }

  loadMoreEvents(event: MouseEvent): void {
    if (!this.isLoaded) {
      this._loadEvents(this.eventsType, false);
    }
  }

  /**
   * Load events from EventsService
   * @param {EventsType} type    Type of events to show
   * @param {boolean}    initial Indicator whether loading events initially or loading more events
   */
  private _loadEvents(type: EventsType, initial: boolean): void {
    if (initial) {
      this.afterLoadEvents(type);
      this.eventsService.loadInitial(type);
    } else {
      this.eventsService.loadMore(type);
    }

  }
}
