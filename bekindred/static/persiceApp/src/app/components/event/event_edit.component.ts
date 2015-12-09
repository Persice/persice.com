import {Component, NgClass, NgIf, Input, Output, EventEmitter} from 'angular2/angular2';
import {Router} from 'angular2/router';

import {EventService} from '../../services/event.service';
import {NotificationService} from '../../services/notification.service';


import {SelectDirective} from '../../directives/select.directive';
import {GeocompleteDirective} from '../../directives/geocomplete.directive';
import {DatepickerDirective} from '../../directives/datepicker.directive';
import {TimepickerDirective} from '../../directives/timepicker.directive';

import {EventModel, EventOpenTo} from '../../models/event.model';
import {NotificationComponent} from '../notification/notification.component';
import {GoogleUtil, ObjectUtil, DateUtil} from '../../core/util';

import {BaseEventComponent} from './base_event.component';

declare var jQuery: any;
let view = require('./event_form.html');


@Component({
  selector: 'event-edit',
  template: view,
  directives: [
    SelectDirective,
    NotificationComponent,
    NgClass,
    GeocompleteDirective,
    DatepickerDirective,
    TimepickerDirective
  ],
  providers: [EventService]

})
export class EventEditComponent extends BaseEventComponent {

  @Input() event;
  @Input() type;
  @Output() refreshEvent: EventEmitter<any> = new EventEmitter();

  eventId: number = null;
  resourceUri: string = null;

  constructor(
    public service: EventService,
    public notificationService: NotificationService,
    public router: Router
  ) {
    super(service, notificationService, 'edit');
    this.router = router;
  }


  ngOnChanges(values) {
    if ('event' in values && Object.keys(values.event.currentValue).length > 0) {
      let ev = values.event.currentValue;
      this.eventId = ev.id;
      this.resourceUri = ev.resource_uri;
      this.model.name = ev.name;
      this.model.description = ev.description;
      this.model.starts_on = ev.starts_on;
      this.model.ends_on = ev.ends_on;
      this.model.location = ev.location;
      this.model.location_name = ev.location_name;
      this.model.event_location = ev.location_name;
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

      //assing dates
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

      jQuery('#starts_on_date').pickadate('picker').set('select', this.START_DATE);
      jQuery('#ends_on_date').pickadate('picker').set('select', this.END_DATE);
      jQuery('#starts_on_time').pickatime('picker').set('select', this.START_TIME);
      jQuery('#ends_on_time').pickatime('picker').set('select', this.END_TIME);
    }
  }

  saveEvent(event) {
    this.showValidationError = false;
    this.service.updateByUri(this.model, this.resourceUri).subscribe((res) => {
      this.validationErrors = {};
      this._notifySuccess('Event has been updated.');
      this.refreshEvent.next(true);
      let remodal = jQuery('[data-remodal-id=edit-event]').remodal();
      remodal.close();
    }, (err) => {
      if ('validationErrors' in err) {
        this.validationErrors = err.validationErrors;
      }

      if ('status' in err && err.status === 400) {
        let parseError = JSON.parse(err.responseText);
        if ('event' in parseError) {
          this.notification.body = parseError.event.error[0];
        }
        else {
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
      this.router.parent.navigate(['./Events', 'AllEventsList']);
    }, (err) => {
      if ('status' in err) {
        let parseError = JSON.parse(err.responseText);
        this.notification.body = 'Your event could not be deleted.';
        this.showValidationError = true;
      }

    }, () => {

    });
  }


}




