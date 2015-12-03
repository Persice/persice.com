/// <reference path="../../typings/_custom.d.ts" />
import {DateUtil} from '../core/util';

export class EventModel {
  constructor(
    public name: String = '',
    public description: String = '',
    public location: String = '',
    public max_attendees: number,
    public access_level: String,
    public starts_on: String = DateUtil.todayRoundUp().utc().format(),
    public ends_on: String = DateUtil.todayAddHourRoundUp().utc().format(),
    public repeat: String = 'w',
    public event_photo: String = '',
    public street: String = '',
    public city: String = '',
    public zipcode: String = '',
    public state: String = '',
    public full_address: String = '',
    public location_name: String = '',
    public country: String = '',
    public address: String = ''
  ) {

  }
}
