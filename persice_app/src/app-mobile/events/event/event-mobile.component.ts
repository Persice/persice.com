import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppStateService } from '../../shared/services/app-state.service';
import { EventService } from '../../../common/events/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingComponent } from '../../../app/shared/components/loading/loading.component';
import { EventHeroMobileComponent } from './event-hero';
import { EventDetailsMobileComponent } from './event-details';
import { EventDetailsBottomMobileComponent } from './event-details-bottom';
import { EventAttendeesPreviewMobileComponent } from './event-attendees-preview';
import { EventNotFoundMobileComponent } from './event-not-found';
import { EventRsvpMobileComponent } from './event-rsvp/event-rsvp-mobile.component';
import { EventComponent } from '../../../common/events/event.component';
import { HeaderState } from '../../header/header.state';

@Component({
  selector: 'prs-mobile-event',
  template: <any>require('./event-mobile.html'),
  providers: [EventService],
  directives: [
    LoadingComponent,
    EventHeroMobileComponent,
    EventRsvpMobileComponent,
    EventDetailsMobileComponent,
    EventAttendeesPreviewMobileComponent,
    EventDetailsBottomMobileComponent,
    EventNotFoundMobileComponent
  ]
})
export class EventMobileComponent extends EventComponent implements OnInit, OnDestroy {

  constructor(
    eventService: EventService,
    route: ActivatedRoute,
    private appStateService: AppStateService,
    private router: Router
  ) {
    super(eventService, route);
  }

  ngOnInit(): any {
    document.querySelector('html').classList.toggle('bg-gray');
    this.ngInit();
  }

  ngOnDestroy(): any {
    document.querySelector('html').classList.toggle('bg-gray');
    this.ngDestroy();
  }

  onEventNotFound() {
    this.appStateService.headerStateEmitter.emit(HeaderState.eventNotFound);
  }

  onEventFound() {
    this.appStateService.headerStateEmitter.emit(HeaderState.event);
  }

  public openAttendees(event: MouseEvent): void {
    this.router.navigateByUrl(`event/${this.eventIdFromUrl}/attendees`);
  }
}
