import { Subscription, Observable } from 'rxjs';
import { TokenUtil } from '../../common/core/util';
import { EventsService } from './events.service';
import { EventsType, Event } from '../models/event/index';

export abstract class EventsComponent {

  protected LIST_TYPE: string = 'events';
  protected eventsType: EventsType;
  protected eventsTypeLabel: string;
  protected filtersActive: boolean;

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
    protected eventsService: EventsService
  ) {
    this.username = TokenUtil.getValue('username');
    this.userId = TokenUtil.getValue('user_id');
  }

  protected onInit(): void {

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

  protected onDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
    if (this.isLoadedSub) {
      this.isLoadedSub.unsubscribe();
    }
  }

  protected afterLoadEvents(type: EventsType): void { }

  protected selectEventsType(type: EventsType): void {
    this.eventsType = type;
    this._loadEvents(type, true);
  }

  protected loadEvents(): void {
    this._loadEvents(this.eventsType, true);
  }

  protected loadMoreEvents(event: MouseEvent): void {
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
