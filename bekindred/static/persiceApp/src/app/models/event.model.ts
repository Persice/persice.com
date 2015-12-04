/// <reference path="../../typings/_custom.d.ts" />
import {DateUtil} from '../core/util';

export class EventModel {
  constructor(
    public name: string = '',
    public description: string = '',
    public access_level: string = 'connections',
    public starts_on: string = DateUtil.todayRoundUp().utc().format(),
    public ends_on: string = DateUtil.todayAddHourRoundUp().utc().format(),
    public repeat: string = 'w',
    public event_photo: string = '',
    public street: string = '',
    public city: string = '',
    public zipcode: string = '',
    public state: string = '',
    public full_address: string = '',
    public location_name: string = '',
    public country: string = '',
    public address: string = '',
    public location: string = '',
    public max_attendees?: number
  ) {

  }
}


export const EventOpenTo: Object[] = [
  {
    'label': 'Only my connections (default)',
    'value': 'connections',
    'selected': true
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
