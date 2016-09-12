import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventDescriptionComponent } from './event-description';
import { EventHostComponent } from './event-host';
import { EventInfoComponent } from './event-info';
import { EventPhotoMapComponent } from './event-photo-map';
import { EventDiscussionComponent } from './event-discussion';
import { EventEditComponent } from './event-edit.component';
import { EventAttendeesComponent } from './event-attendees';
import { LoadingComponent } from '../../shared/components/loading';
import { EventMembersService, EventAttendeesService } from '../../shared/services';
import { EventService } from '../../../common/events/event.service';
import { RemodalDirective } from '../../shared/directives';
import { EventComponent } from '../../../common/events/event.component';
import { AppStateService } from '../../../app-mobile/shared/services/app-state.service';

@Component({
  selector: 'prs-event',
  template: <any>require('./event.html'),
  directives: [
    EventInfoComponent,
    EventHostComponent,
    EventDescriptionComponent,
    EventPhotoMapComponent,
    EventDiscussionComponent,
    EventAttendeesComponent,
    EventEditComponent,
    RemodalDirective,
    LoadingComponent
  ],
  providers: [EventService, EventMembersService, EventAttendeesService, AppStateService]
})
export class EventDesktopComponent extends EventComponent implements AfterViewInit, OnInit, OnDestroy {

  private selected = 'yes';
  private isHost: boolean = false;

  constructor(
    appStateService: AppStateService,
    eventService: EventService,
    route: ActivatedRoute
  ) {
    super(appStateService, eventService, route);
  }

  ngOnInit() {
    this.ngInit();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      window.scrollTo(0, 0);
    });
  }

  ngOnDestroy() {
    jQuery('select.js-select-rep-create-event').minimalect('destroy');

    this.ngDestroy();
  }

  private goBack() {
    window.history.back(-1);
  }

  private activate(type) {
    if (type !== this.selected) {
      this.selected = type;
    }
  }
}
