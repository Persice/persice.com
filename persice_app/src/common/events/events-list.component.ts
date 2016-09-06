import { EventsService } from './events.service';
import { EventsType, Event } from '../../app-mobile/shared/model/event';
import { Observable, Subscription } from 'rxjs';
import { TokenUtil } from '../core/util';
import { FilterService } from '../../app/shared/services/filter.service';

export abstract class EventsListComponent {

  notification = {
    body: '',
    title: '',
    active: false,
    type: 'success'
  };

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
  protected routerSub: Subscription;
  protected username: string;
  protected userId: string;

  constructor(
    private eventsService: EventsService,
    protected filterService: FilterService,
    protected type: EventsType
  ) {
    this.username = TokenUtil.getValue('username');
    this.userId = TokenUtil.getValue('user_id');
    this.eventsType = type;
  }

  public init() {
    this.closeNotification();

    this.events$ = this.eventsService.events$;
    this.isLoading$ = this.eventsService.isLoading$;
    this.notFound$ = this.eventsService.notFound$;
    this.isLoadingInitial$ = this.eventsService.isLoadingInitial$;
    this.isLoadedSub = this.eventsService.isLoaded$.subscribe(
      (state: boolean) => {
        this.isLoaded = state;
        if (this.isLoaded) {
          this.matchHeight();
        }
      }
    );
    this.loadEvents();
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
      this.eventsService.loadInitial(type);
    } else {
      this.eventsService.loadMore(type);
    }

  }

  matchHeight() {
    setTimeout(() => {
      jQuery('.js-match-height-1').matchHeight({
        byRow: false
      });
    });
  }

  closeNotification() {
    this.notification.active = false;
  }

}
