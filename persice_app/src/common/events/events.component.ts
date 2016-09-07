import { Subscription, Observable } from 'rxjs';
import { TokenUtil } from '../../common/core/util';
import { FilterService } from '../../app/shared/services/filter.service';
import { EventsService } from './events.service';
import { EventsType, Event } from '../../app-mobile/shared/model/event';

export abstract class EventsComponent {

  LIST_TYPE: string = 'events';
  eventsType: EventsType;
  eventsTypeLabel: string;
  filtersActive: boolean;

  protected events$: Observable<Event[]>;
  protected isLoading$: Observable<boolean>;
  protected notFound$: Observable<boolean>;
  protected isLoadingInitial$: Observable<boolean>;
  protected isLoadedSub: Subscription;
  protected isLoaded: boolean = false;
  protected routeSub: Subscription;
  protected username: string;
  protected userId: string;

  constructor(
    protected eventsService: EventsService,
    protected filterService: FilterService
  ) {
    this.username = TokenUtil.getValue('username');
    this.userId = TokenUtil.getValue('user_id');
  }

  protected onInit() {

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

  protected onDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
    if (this.isLoadedSub) {
      this.isLoadedSub.unsubscribe();
    }
  }

  protected afterLoadEvents(type: EventsType) { }

  public selectEventsType(type) {
    this.eventsType = type;
    this._loadEvents(type, true);
  }

  public loadEvents() {
    this._loadEvents(this.eventsType, true);
  }

  public loadMoreEvents(event: MouseEvent) {
    if (!this.isLoaded) {
      this._loadEvents(this.eventsType, false);
    }
  }

  /**
   * Load events from EventsService
   * @param {EventsType} type    Type of events to show
   * @param {boolean}    initial Indicator whether loading events initially or loading more events
   */
  private _loadEvents(type: EventsType, initial: boolean) {
    if (initial) {
      this.afterLoadEvents(type);
      this.eventsService.loadInitial(type);
    } else {
      this.eventsService.loadMore(type);
    }

  }
}
