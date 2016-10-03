import { Event } from '../../../../common/models/event';
import { EventService } from '../../../../common/events/event.service';
import { NotificationService } from '../../../../common/services/notification.service';
import { DateUtil, GoogleUtil } from '../../../../common/core/util';
import { Location } from '../../../../common/models/event/location';

export abstract class BaseEventComponent {

  selectedOpenTo: string = 'Public (all Persice users)';
  event: Event;
  eventBackup: Event;

  validationErrors: any = {};
  showValidationError: boolean = false;

  notification = {
    title: 'There are some errors. Please correct them below.',
    body: '',
    type: 'error'
  };

  start_date_picker: number;
  end_date_picker: number;
  start_time_picker: number;
  end_time_picker: number;

  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;

  actionType: string;

  constructor(
    protected eventService: EventService,
    protected notificationService: NotificationService,
    protected action: string
  ) {
    this.actionType = action;
  }

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

  setEvent(event: Event) {
    this.event = event;
    if (!!this.event) {
      this.eventBackup = this.event.clone();
    }
  }

  applyBackup() {
    if (!!this.eventBackup) {
      this.event = this.eventBackup.clone();
    }
  }

  refreshBackup() {
    if (!!this.event) {
      this.eventBackup = this.event.clone();
    }

  }

  changeOpenTo(event): void {
    this.event.accessLevel = event;
  }

  changeStartDate(start: string): void {
    if (start !== 'Invalid date') {
      this.start_date = start;
      this.combineDateTime('start');
    } else {
      this.start_date = '';
      this.event.startDateRaw = '';
    }
  }

  changeStartTime(start: string): void {
    if (start !== 'Invalid time') {
      this.start_time = start;
      this.combineDateTime('start');
    } else {
      this.start_time = '';
      this.event.startDateRaw = '';
    }
  }

  changeEndDate(end: string): void {
    if (end !== 'Invalid date') {
      this.end_date = end;
      this.combineDateTime('end');
    } else {
      this.end_date = '';
      this.event.endDateRaw = '';
    }
  }

  changeEndTime(end: string): void {
    if (end !== 'Invalid time') {
      this.end_time = end;
      this.combineDateTime('end');
    } else {
      this.end_time = '';
      this.event.endDateRaw = '';
    }
  }

  changeLocation(loc): void {
    let location: Location = GoogleUtil.parseLocation(loc);
    this.event.updateLocation(location);
  }

  private combineDateTime(type: string): void {
    if (this[ type + '_date' ] && this[ type + '_time' ]) {
      let dateParts = this[ type + '_date' ].split('/');
      let datePartsSorted = [ dateParts[ 2 ], dateParts[ 0 ], dateParts[ 1 ] ];
      let timeParts = this[ type + '_time' ].split(':');
      if (datePartsSorted && timeParts) {
        datePartsSorted[ 1 ] -= 1;
        this.event[ type + 'DateRaw' ] = DateUtil.formatUTC(datePartsSorted.concat(timeParts), 'YYYY-MM-DDTHH:mm:ss');
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
          });
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
