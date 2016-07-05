import {Distance} from './distance';
import {DateUtil} from '../../../app/shared/core/util';
import {EventDate} from './event-date';
export class Event {
  private _name: string;
  private _hostedBy: string;
  private _description: string;
  private _accessLevel: string;
  private _similarity: string;
  private _distance: Distance;
  private _maxAttendees: number;
  private _attendeesGoing: any[];
  private _attendeesMaybe: any[];
  private _attendeesNotGoing: any[];
  private _spotsRemaining: number;
  private _locationName: string;
  private _fullAddress: string;
  private _startDate: EventDate;
  private _endDate: EventDate;

  public static fromDto(dto: any) {
    return new Event(dto);
  }

  constructor(dto: any) {
    this._name = dto.name;
    this._hostedBy = dto.hosted_by;
    this._description = dto.description;
    this._accessLevel = dto.access_level;
    this._similarity = dto.cumulative_match_score;
    this._distance = new Distance(dto.distance);
    this._maxAttendees = dto.max_attendees;
    this._attendeesGoing = dto.attendees_yes;
    this._attendeesNotGoing = dto.attendees_no;
    this._attendeesMaybe = dto.attendees_maybe;
    this._spotsRemaining = dto.spots_remaining;
    this._locationName = dto.location_name;
    this._fullAddress = dto.full_address;
    this._startDate = this._parseEventDateFromField(dto.starts_on);
    this._endDate = this._parseEventDateFromField(dto.ends_on);
  }

  get name(): string {
    return this._name;
  }

  get hostedBy(): string {
    return this._hostedBy;
  }

  get description(): string {
    return this._description;
  }

  get accessLevel(): string {
    return this._accessLevel;
  }

  get similarity(): string {
    return this._similarity;
  }

  get distance(): Distance {
    return this._distance;
  }

  get maxAttendees(): number {
    return this._maxAttendees;
  }

  get attendeesGoing(): any[] {
    return this._attendeesGoing;
  }

  get attendeesMaybe(): any[] {
    return this._attendeesMaybe;
  }

  get attendeesNotGoing(): any[] {
    return this._attendeesNotGoing;
  }

  get spotsRemaining(): number {
    return this._spotsRemaining;
  }

  get locationName(): string {
    return this._locationName;
  }

  get fullAddress(): string {
    return this._fullAddress;
  }

  get startDate(): EventDate {
    return this._startDate;
  }

  get endDate(): EventDate {
    return this._endDate;
  }

  private _parseEventDateFromField(dateField: any): EventDate {
    return new EventDate(
      DateUtil.format(dateField.starts_on, 'hA'),
      DateUtil.format(dateField.starts_on, 'D'),
      DateUtil.format(dateField.starts_on, 'dddd'),
      DateUtil.format(dateField.starts_on, 'MMM'),
      DateUtil.format(dateField.starts_on, 'YYYY')
    );
  }
}
