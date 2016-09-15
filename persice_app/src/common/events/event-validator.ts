import { Event } from '../models/event/index';
let validate: any = <any>require('validate.js');
const moment = require('moment');

validate.extend(<any>validate.validators.datetime, {
  parse: function (value, options) {
    return moment.utc(value);
  },
  format: function (value, options) {
    let format = options.dateOnly ? 'YYYY-MM-DD' : 'YYYY-MM-DDThh:mm:ss';
    return moment.utc(value).format(format);
  }
});

export class EventValidator {

  validationOptions = {
      fullMessage: true
  };

  constraints = {
    name: {
      presence: true,
      length: {
        maximum: 300
      }
    },
    event_url: {
      presence: false,
      length: {
        maximum: 1024
      },
      url: {
        message: '^Please enter a valid url.'
      },
    },
    maxAttendees: {
      presence: true,
      numericality: {
        onlyInteger: true,
        greaterThan: 0
      }
    },
    startDateRaw: {
      presence: true,
      datetime: {
        dateOnly: false,
        earliest: moment.utc(),
        message: '^Start date/time cannot be in the past.'
      }
    },
    endDateRaw: {
      datetime: {
        dateOnly: false,
        earliest: moment.utc().add(30, 'minutes'),
        message: '^End date/time should be after Start date/time.'
      }
    },
    eventLocation: {
      presence: true
    },
    description: {
      presence: true,
      length: {
        maximum: 1000
      }
    }
  };

  public validateData(event: Event): any {
    return validate(event, this.constraints, this.validationOptions);
  }
}
