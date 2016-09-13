import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  SelectDirective,
  GeocompleteDirective,
  DatepickerDirective,
  TimepickerDirective }
from '../../shared/directives';
import { BaseEventComponent } from './base-event.component';
import { EventModel } from '../../shared/models';
import { NotificationComponent } from '../../shared/components/notification';
import { LoadingComponent } from '../../shared/components/loading';
import { DateUtil } from '../../../common/core';
import { EventServiceTemp, NotificationService } from '../../shared/services';

@Component({
  selector: 'prs-event-create',
  template: <any>require('./event-form.html'),
  directives: [
    SelectDirective,
    NotificationComponent,
    GeocompleteDirective,
    DatepickerDirective,
    TimepickerDirective,
    LoadingComponent
  ],
  providers: [EventServiceTemp]
})
export class EventCreateComponent extends BaseEventComponent {
  @Input() type;
  loading: boolean = false;
  START_DATE = DateUtil.todayRoundUp().unix() * 1000;
  END_DATE = DateUtil.todayAddHourRoundUp().unix() * 1000;
  START_TIME = DateUtil.todayRoundUp().hour() * 60 + DateUtil.todayRoundUp().minute();
  END_TIME = DateUtil.todayAddHourRoundUp().hour() * 60 + DateUtil.todayAddHourRoundUp().minute();

  constructor(
    public service: EventServiceTemp,
    public notificationService: NotificationService,
    public router: Router
  ) {
    super(service, notificationService, 'create');
    setTimeout(() => {
      this.model.starts_on_date = DateUtil.todayRoundUp().format('MM/DD/YYYY');
      this.model.ends_on_date = DateUtil.todayAddHourRoundUp().format('MM/DD/YYYY');
      this.model.starts_on_time = DateUtil.todayRoundUp().format('hh:mm');
      this.model.ends_on_time = DateUtil.todayAddHourRoundUp().format('hh:mm');
    });
  }

  saveEvent(event) {
    if (this.loading) {
      return;
    }

    this.loading = true;
    this.showValidationError = false;
    this.service.create(this.model).subscribe((res) => {
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
          this.notification.body = parseError.event.error[0];
        } else {
          this.notification.body = 'There has been an error during saving this event.';
        }
        this.showValidationError = true;

      }
    });
  }

}
