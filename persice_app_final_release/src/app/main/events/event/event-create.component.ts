import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseEventComponent } from './base-event.component';
import { Event } from '../../../../common/models/event';
import { EventService } from '../../../../common/events/event.service';
import { NotificationService } from '../../../../common/services/notification.service';

@Component({
  selector: 'prs-event-create',
  templateUrl: './event-form.html',
  providers: [ EventService, NotificationService ]
})
export class EventCreateComponent extends BaseEventComponent implements OnInit {
  @Input() type: string;

  loading: boolean = false;
  full = true;

  constructor(
    service: EventService,
    notificationService: NotificationService,
    private router: Router
  ) {
    super(service, notificationService, 'create');

    this.event = Event.empty();
  }

  ngOnInit(): any {
    this.initForCreate();
  }

  saveEvent(event: MouseEvent) {
    if (this.loading) {
      return;
    }

    this.loading = true;
    this.showValidationError = false;
    this.eventService.create(this.event).subscribe((res) => {
      this.validationErrors = {};
      this.loading = false;
      this._notifySuccess('Your event has been created.');
      this.router.navigateByUrl('/event/' + res.id);
    }, (err) => {
      this.loading = false;
      if ('validationErrors' in err) {
        this.validationErrors = err.validationErrors;
      }
      if ('status' in err && err.status === 400) {
        let parseError = JSON.parse(err.responseText);
        if ('event' in parseError) {
          this.notification.body = parseError.event.error[ 0 ];
        } else {
          this.notification.body = 'There has been an error during saving this event.';
        }
        this.showValidationError = true;
      }
    });
  }

}
