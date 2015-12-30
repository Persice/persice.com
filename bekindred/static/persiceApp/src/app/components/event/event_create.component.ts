import {Component, Input} from 'angular2/core';
import {Router} from 'angular2/router';

import {SelectDirective} from '../../directives/select.directive';
import {GeocompleteDirective} from '../../directives/geocomplete.directive';
import {DatepickerDirective} from '../../directives/datepicker.directive';
import {TimepickerDirective} from '../../directives/timepicker.directive';
import {EventService} from '../../services/event.service';
import {NotificationService} from '../../services/notification.service';

import {EventModel, EventOpenTo} from '../../models/event.model';
import {NotificationComponent} from '../notification/notification.component';
import {GoogleUtil, ObjectUtil, DateUtil} from '../../core/util';

import {BaseEventComponent} from './base_event.component';

declare var jQuery: any;

let view = require('./event_form.html');

@Component({
  selector: 'event-create',
  template: view,
  directives: [
    SelectDirective,
    NotificationComponent,
    GeocompleteDirective,
    DatepickerDirective,
    TimepickerDirective
  ],
  providers: [EventService]
})
export class EventCreateComponent extends BaseEventComponent {
  @Input() type;


  START_DATE = DateUtil.todayRoundUp().unix() * 1000;
  END_DATE = DateUtil.todayAddHourRoundUp().unix() * 1000;

  START_TIME = DateUtil.todayRoundUp().hour() * 60 + DateUtil.todayRoundUp().minute();
  END_TIME = DateUtil.todayAddHourRoundUp().hour() * 60 + DateUtil.todayAddHourRoundUp().minute();

  constructor(
    public service: EventService,
    public notificationService: NotificationService,
    public router: Router
  ) {
    super(service, notificationService, 'create');
    this.router = router;
    this.model = new EventModel();

    this.model.starts_on_date = DateUtil.todayRoundUp().format('MM/DD/YYYY');
    this.model.ends_on_date = DateUtil.todayAddHourRoundUp().format('MM/DD/YYYY');
    this.model.starts_on_time = DateUtil.todayRoundUp().format('hh:mm');
    this.model.ends_on_time = DateUtil.todayAddHourRoundUp().format('hh:mm');
  }

  saveEvent(event) {
    this.showValidationError = false;
    this.service.create(this.model).subscribe((res) => {
      this.validationErrors = {};
      this._notifySuccess('Your event has been created.');
      this.router.parent.navigate(['/EventDetails', { 'eventId': res.id }]);
    }, (err) => {
      console.log(err);
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

}




