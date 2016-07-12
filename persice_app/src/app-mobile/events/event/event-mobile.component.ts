import {Component, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import {AppStateService} from '../../shared/services/app-state.service';
import {HeaderState} from '../../header/header.state';
import {EventMobileService} from './event-mobile.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadingComponent} from '../../../app/shared/components/loading/loading.component';
import {Event} from '../../shared/model/event';
import {EventHeroMobileComponent} from './event-hero';
import {EventDetailsMobileComponent} from './event-details';
import {EventAttendeesPreviewMobileComponent} from './event-attendees-preview';
import {EventNotFoundMobileComponent} from './event-not-found';
import {Observable, Subscription} from 'rxjs';
import {EventRsvpMobileComponent} from './event-rsvp/event-rsvp-mobile.component';

@Component({
  selector: 'prs-mobile-event',
  template: require('./event-mobile.html'),
  providers: [EventMobileService],
  directives: [
    LoadingComponent,
    EventHeroMobileComponent,
    EventRsvpMobileComponent,
    EventDetailsMobileComponent,
    EventAttendeesPreviewMobileComponent,
    EventNotFoundMobileComponent
  ]
})
export class EventMobileComponent implements OnInit, AfterViewInit, OnDestroy {

  private event$: Observable<Event>;
  private isLoading$: Observable<boolean>;
  private isLoaded$: Observable<boolean>;
  private notFound$: Observable<boolean>;

  private eventIdFromUrl: string;

  private routerSubs: Subscription;
  private notFoundSubs: Subscription;

  constructor(
    private appStateService: AppStateService,
    private eventService: EventMobileService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit(): any {
    document.querySelector('html').classList.toggle('bg-gray');

    // Subscribe to event service observables
    this.event$ = this.eventService.event$;
    this.isLoading$ = this.eventService.isLoading$;
    this.isLoaded$ = this.eventService.isLoaded$;
    this.notFound$ = this.eventService.notFound$;

    // Subscribe to router param observable
    this.routerSubs = this.route.params.subscribe(params => {
      this.eventIdFromUrl = params['eventId'];
      this._getEvent(this.eventIdFromUrl);
    });

    this.notFoundSubs = this.notFound$.subscribe((notFoundState: boolean) => {
      if (!!notFoundState) {
        this.appStateService.headerStateEmitter.emit(HeaderState.eventNotFound);
      } else {
        this.appStateService.headerStateEmitter.emit(HeaderState.event);
      }
    });
  }

  ngAfterViewInit(): any {
    setTimeout(() => {
      window.scrollTo(0, 0);
    });
  }

  ngOnDestroy(): any {
    document.querySelector('html').classList.toggle('bg-gray');
    if (this.routerSubs) {
      this.routerSubs.unsubscribe();
    }
    if (this.notFoundSubs) {
      this.notFoundSubs.unsubscribe();
    }

  }

  public openAttendees(event: MouseEvent): void {
    this.router.navigateByUrl(`event/${this.eventIdFromUrl}/attendees`);
  }

  public changeRsvp(event: Event) {
    console.log('changing rsvp');
  }

  private _getEvent(eventId: string): void {
    this.eventService.load(this.eventIdFromUrl);
  }
}
