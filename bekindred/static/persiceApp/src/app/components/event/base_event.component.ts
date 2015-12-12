import {EventService} from '../../services/event.service';
import {NotificationService} from '../../services/notification.service';

import {EventModel, EventOpenTo} from '../../models/event.model';
import {GoogleUtil, ObjectUtil, DateUtil} from '../../core/util';

const moment = require('moment');

declare var jQuery: any;

export abstract class BaseEventComponent {
  model;
  action: string;
  validationErrors = {};
  showValidationError: boolean = false;
  notification = {
    title: 'There are some errors. Please correct them below.',
    body: '',
    type: 'error'
  };

  openTo: any = EventOpenTo;

  START_DATE = null;
  END_DATE = null;

  START_TIME = null;
  END_TIME = null;
  full = true;

  constructor(
    public service: EventService,
    public notificationService: NotificationService,
    action: string
  ) {
    this.model = new EventModel();
    this.action = action;
  }

  changeOpenTo(event) {
    this.model.access_level = event;
  }

  changeStartDate(event) {
    if (event !== 'Invalid date') {
      this.model.starts_on_date = event;
      this.combineDateTime('starts_on');
    }
    else {
      this.model.starts_on_date = '';
      this.model.starts_on = '';

    }

  }

  changeStartTime(event) {
    if (event !== 'Invalid time') {
      this.model.starts_on_time = event;
      this.combineDateTime('starts_on');
    }
    else {
      this.model.starts_on_time = '';
      this.model.starts_on = '';

    }

  }

  changeEndDate(event) {
    if (event !== 'Invalid date') {
      this.model.ends_on_date = event;
      this.combineDateTime('ends_on');
    }
    else {
      this.model.ends_on_date = '';
      this.model.ends_on = '';

    }

  }

  changeEndTime(event) {

    if (event !== 'Invalid time') {
      this.model.ends_on_time = event;
      this.combineDateTime('ends_on');
    }
    else {
      this.model.ends_on_time = '';
      this.model.ends_on = '';

    }

  }

  changeLocation(event) {
    let loc = GoogleUtil.parseLocation(event);
    this.model = ObjectUtil.merge(this.model, loc);
  }

  combineDateTime(type) {
    if (this.model[type + '_date'] && this.model[type + '_time']) {
      let dateParts = this.model[type + '_date'].split('/');
      let datePartsSorted = [dateParts[2], dateParts[0], dateParts[1]];
      let timeParts = this.model[type + '_time'].split(':');
      if (datePartsSorted && timeParts) {
        datePartsSorted[1] -= 1;
        this.model[type] = DateUtil.formatUTC(datePartsSorted.concat(timeParts), 'YYYY-MM-DDTHH:mm:ss');
        //ensure that end date/time on is always after start date/time
        if (type === 'starts_on' && DateUtil.moment(this.model.starts_on) >= DateUtil.moment(this.model.ends_on)) {
          console.log('changing start');
          let startDate = DateUtil.convertToLocal(this.model.starts_on).add(1, 'hours');

          this.END_DATE = startDate.unix() * 1000;
          this.END_TIME = startDate.hour() * 60 + startDate.minute();

          this.model.ends_on_date = startDate.format('MM/DD/YYYY');
          this.model.ends_on_time = startDate.format('hh:mm');

          jQuery('#ends_on_date').pickadate('picker').set('select', this.END_DATE);
          jQuery('#ends_on_time').pickatime('picker').set('select', this.END_TIME);
        }

      }
    }
  }

  _notifySuccess(body) {
    this.notificationService.push({
      type: 'success',
      title: 'Success',
      body: body,
      autoclose: 4000
    });
  }


}




