import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EventDescriptionComponent } from './event-description';
import { EventHostComponent } from './event-host';
import { EventInfoComponent } from './event-info';
import { EventPhotoMapComponent } from './event-photo-map';
import { EventDiscussionComponent } from './event-discussion';
import { EventEditComponent } from './event-edit.component';
import { EventAttendeesComponent } from './event-attendees';
import { LoadingComponent } from '../../shared/components/loading';
import { EventAttendeesService } from '../../shared/services';
import { EventService } from '../../../common/events/event.service';
import { RemodalDirective } from '../../shared/directives';
import { EventComponent } from '../../../common/events/event.component';
import { NotificationService } from '../../shared/services/notification.service';
import { EventUrlComponent } from './event-url/event-url.component';

@Component({
  selector: 'prs-event',
  template: <any>require('./event-desktop.html'),
  directives: [
    EventInfoComponent,
    EventHostComponent,
    EventDescriptionComponent,
    EventUrlComponent,
    EventPhotoMapComponent,
    EventDiscussionComponent,
    EventAttendeesComponent,
    EventEditComponent,
    RemodalDirective,
    LoadingComponent
  ],
  providers: [EventService, EventAttendeesService, NotificationService]
})
export class EventDesktopComponent extends EventComponent implements OnInit, OnDestroy {

  private selected = 'yes';

  constructor(
    eventService: EventService,
    route: ActivatedRoute,
    private notificationService: NotificationService,
    private location: Location
  ) {
    super(eventService, route);
  }

  ngOnInit() {
    this.ngInit();
  }

  ngOnDestroy() {
    this.ngDestroy();
  }

  onEventNotFound() {
    this.notificationService.push({
      type: 'error',
      title: 'Error',
      body: 'This event doesn\'t exist.',
      autoclose: 4000
    });
    this.goBack();
  }

  private goBack() {
    // window.history.back(-1);
    this.location.back();
  }

  private activate(type) {
    if (type !== this.selected) {
      this.selected = type;
    }
  }
}
