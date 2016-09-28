import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppStateService } from '../../../shared/services/app-state.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../../common/events/event.service';
import { EventComponent } from '../../../../common/events/event.component';
import { HeaderState } from '../../header/header.state';

@Component({
  selector: 'prs-mobile-event',
  templateUrl: './event-mobile.html',
  providers: [EventService]
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
