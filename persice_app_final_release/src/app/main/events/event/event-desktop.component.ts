import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../../../common/events/event.service';
import { EventAttendeesService } from '../../../../common/services/eventattendees.service';
import { NotificationService } from '../../../../common/services/notification.service';
import { EventComponent } from '../../../../common/events/event.component';

@Component({
  selector: 'prs-event',
  templateUrl: './event-desktop.html',
  providers: [ EventService, EventAttendeesService, NotificationService ]
})
export class EventDesktopComponent extends EventComponent implements OnInit, OnDestroy {

  selected = 'yes';
  isEditVisible: boolean = false;

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

  public goBack() {
    this.location.back();
  }

  public activate(type) {
    if (type !== this.selected) {
      this.selected = type;
    }
  }
}
