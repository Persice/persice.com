import { Observable, Subscription } from 'rxjs';
import { EventService } from './event.service';
import { Event } from './../models/event/index';
import { ActivatedRoute } from '@angular/router';
import { TokenUtil } from '../core/util';

export abstract class EventComponent {

  protected event$: Observable<Event>;
  protected isLoading$: Observable<boolean>;
  protected isLoaded$: Observable<boolean>;
  protected notFound$: Observable<boolean>;

  protected eventIdFromUrl: string;

  protected usernameFromToken: string;
  protected userIdFromToken: string;

  private routerSubs: Subscription;
  private notFoundSubs: Subscription;

  constructor(
    protected eventService: EventService,
    protected route: ActivatedRoute
  ) { }

  protected ngInit(): void {
    setTimeout(() => {
      window.scrollTo(0, 0);
    });

    // Subscribe to event service observables
    this.event$ = this.eventService.event$;
    this.isLoading$ = this.eventService.isLoading$;
    this.isLoaded$ = this.eventService.isLoaded$;
    this.notFound$ = this.eventService.notFound$;

    // Get username and user_id for RSVP
    this.usernameFromToken = TokenUtil.getValue('username');
    this.userIdFromToken = TokenUtil.getValue('user_id');

    // Subscribe to router param observable
    this.routerSubs = this.route.params.subscribe(params => {
      this.eventIdFromUrl = params['eventId'];
      this._getEvent(this.eventIdFromUrl);
    });

    this.notFoundSubs = this.notFound$.subscribe((notFoundState: boolean) => {
      if (!!notFoundState) {
        this.onEventNotFound();
      } else {
        this.onEventFound();
      }
    });
  }

  protected ngDestroy(): void {
    if (this.routerSubs) {
      this.routerSubs.unsubscribe();
    }
    if (this.notFoundSubs) {
      this.notFoundSubs.unsubscribe();
    }
  }

  protected onEventNotFound(): void {}

  protected onEventFound(): void {}

  private _getEvent(eventId: string): void {
    this.eventService.load(eventId);
  }

  private refreshEvent() {
    this.eventService.load(this.eventIdFromUrl);
  }
}
