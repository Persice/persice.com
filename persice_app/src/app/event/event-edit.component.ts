import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { SelectDirective, GeocompleteDirective, DatepickerDirective, TimepickerDirective } from '../shared/directives';
import { BaseEventComponent } from './base-event.component';
import { NotificationComponent } from '../shared/components/notification';
import { LoadingComponent } from '../shared/components/loading';
import { DateUtil } from '../../common/core';
import { EventService, NotificationService } from '../shared/services';

@Component({
  selector: 'prs-event-edit',
  template: <any>require('./event-form.html'),
  directives: [
    SelectDirective,
    NotificationComponent,
    GeocompleteDirective,
    DatepickerDirective,
    TimepickerDirective,
    LoadingComponent
  ],
  providers: [EventService]
})
export class EventEditComponent extends BaseEventComponent {

  @Input() set event(data: any) {
    this.eventOriginal = data;
    this.setEvent(data);
  }

  @Input() type;
  @Output() refreshEvent: EventEmitter<any> = new EventEmitter();

  eventOriginal: any;
  eventId: number = null;
  resourceUri: string = null;

  START_DATE = null;
  END_DATE = null;

  START_TIME = null;
  END_TIME = null;

  loading: boolean = false;

  constructor(
    public service: EventService,
    public notificationService: NotificationService,
    public router: Router
  ) {
    super(service, notificationService, 'edit');
  }

  setEvent(data) {
    let ev = data;
    this.eventId = ev.id;
    this.resourceUri = ev.resource_uri;
    this.model.name = ev.name;
    this.model.description = ev.description;
    this.model.starts_on = ev.starts_on;
    this.model.ends_on = ev.ends_on;
    this.model.event_photo = ev.event_photo;
    this.model.location = ev.location;
    this.model.location_name = ev.location_name;
    this.model.event_location = ev.full_address !== '' ? ev.full_address : ev.location_name;

    if (this.model.event_location.indexOf(ev.location_name) === -1) {
      this.model.event_location = ev.location_name + ', ' + this.model.event_location;
    }

    this.model.max_attendees = ev.max_attendees;
    this.model.access_level = ev.access_level;

    let selectOpenTo = [
      {
        'label': 'Only my connections (default)',
        'value': 'connections',
        'selected': false
      },
      {
        'label': 'Public (all Persice users)',
        'value': 'public',
        'selected': false
      },
      {
        'label': 'Private (only invited)',
        'value': 'private',
        'selected': false
      }
    ];

    for (var i = 0; i < selectOpenTo.length; ++i) {
      if (selectOpenTo[i].value === this.model.access_level) {
        selectOpenTo[i].selected = true;
      }
    }

    this.openTo = selectOpenTo;

    //assign dates
    let startDate = DateUtil.convertToLocal(this.model.starts_on);

    let endDate = DateUtil.convertToLocal(this.model.ends_on);

    this.START_DATE = startDate.unix() * 1000;
    this.END_DATE = endDate.unix() * 1000;
    this.START_TIME = startDate.hour() * 60 + startDate.minute();
    this.END_TIME = endDate.hour() * 60 + endDate.minute();

    this.model.starts_on_date = startDate.format('MM/DD/YYYY');
    this.model.ends_on_date = endDate.format('MM/DD/YYYY');
    this.model.starts_on_time = startDate.format('hh:mm');
    this.model.ends_on_time = endDate.format('hh:mm');

  }

  saveEvent(event) {
    if (this.loading) {
      return;
    }
    this.loading = true;
    this.showValidationError = false;
    this.service.updateByUri(this.model, this.resourceUri).subscribe((res) => {
      this.loading = false;
      this.validationErrors = {};
      this._notifySuccess('Event has been updated.');
      this.refreshEvent.emit(true);
      let remodal = jQuery('[data-remodal-id=edit-event]').remodal();
      remodal.close();
    }, (err) => {
      this.loading = false;
      if ('validationErrors' in err) {
        this.validationErrors = err.validationErrors;
      }

      if ('status' in err && err.status === 400) {
        let parseError = JSON.parse(err.responseText);
        if ('event' in parseError) {
          this.notification.body = parseError.event.error[0];
        } else {
          this.notification.body = 'There has been an error during saving this event.';
        }
        this.showValidationError = true;

      }

    }, () => {
    });
  }

  deleteEvent(event) {
    this.showValidationError = false;
    this.service.deleteByUri(this.resourceUri).subscribe((res) => {
      this.showValidationError = false;
      this._notifySuccess(`Your event ${this.model.name} has been deleted.`);
      this.router.navigateByUrl('/events/all/list');
    }, (err) => {
      if ('status' in err) {
        this.notification.body = 'Your event could not be deleted.';
        this.showValidationError = true;
      }
    });
  }

}
