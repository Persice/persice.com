import { Observable } from 'rxjs/Rx';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppStateService } from '../../../shared/services/app-state.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../../common/events/event.service';
import { EventComponent } from '../../../../common/events/event.component';
import { HeaderState } from '../../header/header.state';
import { EventInterestsService } from '../interests/event-interests.service';

@Component({
  selector: 'prs-mobile-event',
  templateUrl: './event-mobile.html',
  providers: [ EventService, EventInterestsService ]
})
export class EventMobileComponent extends EventComponent implements OnInit, OnDestroy {
  public sharedInterestsCount$: Observable<number>;

  constructor(
    eventService: EventService,
    route: ActivatedRoute,
    private appStateService: AppStateService,
    private router: Router,
    private eventInterestsService: EventInterestsService
  ) {
    super(eventService, route);
  }

  ngOnInit(): any {
    document.querySelector('html').classList.toggle('bg-gray');
    this.ngInit();

    this.sharedInterestsCount$ = this.eventInterestsService.count$;

    this.eventInterestsService.loadCount(this.eventIdFromUrl);


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
