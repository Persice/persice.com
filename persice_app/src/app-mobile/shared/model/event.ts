import {Distance} from './distance';
import {DateUtil} from '../../../app/shared/core/util';
import {EventDate} from './event-date';
export class Event {
  private _id: string;
  private _name: string;
  private _image: string;
  private _hostedBy: string;
  private _description: string;
  private _accessLevel: string;
  private _similarity: string;
  private _distance: Distance;
  private _connectionsAttendeesCount: number;
  private _maxAttendees: number;
  private _attendeesGoing: any[];
  private _attendeesMaybe: any[];
  private _attendeesNotGoing: any[];
  private _attendeesPreview: any[];
  private _spotsRemaining: number;
  private _locationName: string;
  private _fullAddress: string;
  private _startDate: EventDate;
  private _endDate: EventDate;

  public static fromDto(dto: any) {
    return new Event(dto);
  }

  constructor(dto: any) {
    this._id = dto.id;
    this._name = dto.name;
    this._image = dto.event_photo;
    this._hostedBy = dto.hosted_by;
    this._description = dto.description;
    this._accessLevel = dto.access_level;
    this._similarity = dto.cumulative_match_score;
    this._distance = new Distance(dto.distance);
    this._connectionsAttendeesCount = dto.friend_attendees_count;
    this._maxAttendees = dto.max_attendees;
    this._attendeesGoing = dto.attendees_yes;
    this._attendeesNotGoing = dto.attendees_no;
    this._attendeesMaybe = dto.attendees_maybe;
    this._attendeesPreview = this._makeAttendeesPreview(this._attendeesGoing);
    this._spotsRemaining = dto.spots_remaining;
    this._locationName = dto.location_name;
    this._fullAddress = dto.full_address;
    this._startDate = this._parseEventDateFromField(dto.starts_on);
    this._endDate = this._parseEventDateFromField(dto.ends_on);
  }

  get name(): string {
    return this._name;
  }

  get id(): string {
    return this._id;
  }

  get image(): string {
    return this._image;
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

  get connectionsAttendeesCount(): number {
    return this._connectionsAttendeesCount;
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

  get timezone(): string {
    return DateUtil.localTimezone();
  }

  get attendeesPreview(): any[] {
    return this._attendeesPreview;
  }

  private _parseEventDateFromField(dateField: any): EventDate {
    return new EventDate(
      DateUtil.format(dateField, 'hA'),
      DateUtil.format(dateField, 'D'),
      DateUtil.format(dateField, 'dddd'),
      DateUtil.format(dateField, 'MMM'),
      DateUtil.format(dateField, 'YYYY')
    );
  }

  private _makeAttendeesPreview(attendees: any[]): any {
    let result = [];
    let max = attendees.length < 6 ? attendees.length : 6;
    for (let i = 0; i < max; i++) {
      result = [...result,
        { first_name: attendees[i].first_name, image: attendees[i].image }];
    }

    return result;
  }

}
