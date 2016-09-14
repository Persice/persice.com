import { NotificationService } from '../../shared/services';
import { GoogleUtil, DateUtil } from '../../../common/core';
import { Event } from '../../../common/models/event/index';
import { Location } from '../../../common/models/event/location';
import { EventService } from '../../../common/events/event.service';

export abstract class BaseEventComponent {

  protected selectedOpenTo: string = 'Public (all Persice users)';
  protected event: Event;

  protected validationErrors = {};
  protected showValidationError: boolean = false;

  protected notification = {
    title: 'There are some errors. Please correct them below.',
    body: '',
    type: 'error'
  };

  protected start_date_picker: number;
  protected end_date_picker: number;
  protected start_time_picker: number;
  protected end_time_picker: number;

  protected start_date: string;
  protected start_time: string;
  protected end_date: string;
  protected end_time: string;

  constructor(
    protected eventService: EventService,
    protected notificationService: NotificationService,
    protected action: string
  ) { }

  protected initForCreate(): void {
    this.start_date_picker = DateUtil.todayRoundUp().unix() * 1000;
    this.end_date_picker = DateUtil.todayAddHourRoundUp().unix() * 1000;
    this.start_time_picker = DateUtil.todayRoundUp().hour() * 60 + DateUtil.todayRoundUp().minute();
    this.end_time_picker = DateUtil.todayAddHourRoundUp().hour() * 60 + DateUtil.todayAddHourRoundUp().minute();
  }

  protected initForEdit(): void {
    let startDate = DateUtil.convertToLocal(this.event.startDateRaw);
    let endDate = DateUtil.convertToLocal(this.event.endDateRaw);

    this.start_date_picker = startDate.unix() * 1000;
    this.end_date_picker = endDate && endDate.unix() * 1000;
    this.start_time_picker = startDate.hour() * 60 + startDate.minute();
    this.end_time_picker = endDate && (endDate.hour() * 60 + endDate.minute());
  }

  protected setEvent(event: Event) {
    this.event = event;
  }

  protected changeOpenTo(event): void {
    this.event.accessLevel = event;
  }

  protected changeStartDate(start: string): void {
    if (start !== 'Invalid date') {
      this.start_date = start;
      this.combineDateTime('start');
    } else {
      this.start_date = '';
      this.event.startDateRaw = '';
    }
  }

  protected changeStartTime(start: string): void {
    if (start !== 'Invalid time') {
      this.start_time = start;
      this.combineDateTime('start');
    } else {
      this.start_time = '';
      this.event.startDateRaw = '';
    }
  }

  protected changeEndDate(end: string): void {
    if (end !== 'Invalid date') {
      this.end_date = end;
      this.combineDateTime('end');
    } else {
      this.end_date = '';
      this.event.endDateRaw = '';
    }
  }

  protected changeEndTime(end: string): void {
    if (end !== 'Invalid time') {
      this.end_time = end;
      this.combineDateTime('end');
    } else {
      this.end_time = '';
      this.event.endDateRaw = '';
    }
  }

  protected changeLocation(loc): void {
    let location: Location = GoogleUtil.parseLocation(loc);
    this.event.updateLocation(location);
  }

  private combineDateTime(type: string): void {
    if (this[type + '_date'] && this[type + '_time']) {
      let dateParts = this[type + '_date'].split('/');
      let datePartsSorted = [dateParts[2], dateParts[0], dateParts[1]];
      let timeParts = this[type + '_time'].split(':');
      if (datePartsSorted && timeParts) {
        datePartsSorted[1] -= 1;
        this.event[type + 'DateRaw'] = DateUtil.formatUTC(datePartsSorted.concat(timeParts), 'YYYY-MM-DDTHH:mm:ss');
        //ensure that end date/time on is always after start date/time
        if (type === 'start' && DateUtil.moment(this.event.startDateRaw) >= DateUtil.moment(this.event.endDateRaw)) {
          let startDate = DateUtil.convertToLocal(this.event.startDateRaw).add(1, 'hours');

          this.end_date_picker = startDate.unix() * 1000;
          this.end_time_picker = startDate.hour() * 60 + startDate.minute();

          this.end_date = startDate.format('MM/DD/YYYY');
          this.end_time = startDate.format('hh:mm');

          setTimeout(() => {
            jQuery('#end_date').pickadate('picker').set('select', this.end_date_picker);
            jQuery('#end_time').pickatime('picker').set('select', this.end_time_picker);
          }, 400);
        }
      }
    }
  }

  protected _notifySuccess(body): void {
    this.notificationService.push({
      type: 'success',
      title: 'Success',
      body: body,
      autoclose: 4000
    });
  }
}
