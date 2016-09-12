import { Distance } from '../distance';
import { DateUtil, ListUtil, TokenUtil } from '../../core/util';
import { EventDate } from './event-date';
import { EventHost } from './event-host';

export class Event {
  private _id: string;
  private _name: string;
  private _image: string;
  private _hostedBy: string;
  private _description: string;
  private _accessLevel: string;
  private _similarity: string;
  private _distance: Distance;
  private _latitude: string;
  private _longitude: string;
  private _mapUrl: string;
  private _connectionsAttendeesCount: number;
  private _maxAttendees: number;
  private _attendeesGoing: any[];
  private _attendeesMaybe: any[];
  private _attendeesNotGoing: any[];
  private _attendeesPreview: any[];
  private _spotsRemaining: number;
  private _locationName: string;
  private _locationRaw: string;
  private _fullAddress: string;
  private _startDate: EventDate;
  private _endDate: EventDate;
  private _startDateRaw: string;
  private _endDateRaw: string;
  private _resourceUri: string;
  private _eventHost: EventHost;
  private _isHost: boolean;

  public static fromDto(dto: any) {
    return new Event(dto);
  }

  constructor(dto: any) {
    this._id = dto.id;
    this._name = dto.name;
    this._image = !!dto.event_photo && dto.event_photo !== 'https://d2v6m3k9ul63ej.cloudfront.net/null' ? dto.event_photo : '/assets/images/placeholder-image.png';
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
    this._startDateRaw = dto.starts_on;
    this._endDateRaw = dto.ends_on;
    this._locationRaw = dto.location;
    this._resourceUri = dto.resource_uri;
    this._latitude = dto.location.split(',')[0];
    this._longitude = dto.location.split(',')[1];
    this._mapUrl = `https://www.google.com/maps/place/${this._latitude}+${this._longitude}/@${this._latitude},${this._longitude},15z`;
    this._eventHost = this._getHostForEvent(dto);
    this._isHost = this._eventHost.username === TokenUtil.getValue('username') ? true : false;
  }

  public rsvpOfUsername(username: string): any {
    for (let user of this._attendeesGoing) {
      if (user.username === username) {
        return {rsvp: 'yes', member_id: user.membership_id};
      }
    }
    for (let user of this._attendeesMaybe) {
      if (user.username === username) {
        return {rsvp: 'maybe', member_id: user.membership_id};
      }
    }
    for (let user of this._attendeesNotGoing) {
      if (user.username === username) {
        return {rsvp: 'no', member_id: user.membership_id};
      }
    }

    return {};
  }

  public host(eventHost: EventHost): void {
    this._eventHost = eventHost;
  }

  public get isHost(): boolean {
    return this._isHost;
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

  get startDateRaw(): string {
    return this._startDateRaw;
  }

  get endDateRaw(): string {
    return this._endDateRaw;
  }

  get locationRaw(): string {
    return this._locationRaw;
  }

  get timezone(): string {
    return DateUtil.localTimezone();
  }

  get attendeesPreview(): any[] {
    return this._attendeesPreview;
  }

  get resourceUri(): string {
    return this._resourceUri;
  }

  get latitude(): string {
    return this._latitude;
  }

  get latitudeNumber(): number {
    return +this.latitude;
  }

  get longitudeNumber(): number {
    return +this.longitude;
  }

  get longitude(): string {
    return this._longitude;
  }

  get mapUrl(): string {
    return this._mapUrl;
  }

  get eventHost(): EventHost {
    return this._eventHost;
  }

  set eventHost(eventHost: EventHost) {
    this._eventHost = eventHost;
  }

  private _parseEventDateFromField(dateField: any): EventDate {
    return new EventDate(
      DateUtil.format(dateField, 'h:mmA'),
      DateUtil.format(dateField, 'D'),
      DateUtil.format(dateField, 'dddd'),
      DateUtil.format(dateField, 'ddd'),
      DateUtil.format(dateField, 'MMM'),
      DateUtil.format(dateField, 'YYYY')
    );
  }

  private _makeAttendeesPreview(attendees: any[]): any {
    let result = [];
    let max = attendees.length < 4 ? attendees.length : 4;
    for (let i = 0; i < max; i++) {
      result = [...result, {image: attendees[i].image, isHost: attendees[i].is_organizer}];
    }

    result = ListUtil.orderBy(result, ['isHost'], 'desc');

    return result;
  }

  private _getHostForEvent(dto: any): EventHost {
    let attendees = [...dto.attendees_yes, ...dto.attendees_maybe, ...dto.attendees_no];
    let host = attendees.find(function (attendee) {
      return attendee.is_organizer;
    });

    return new EventHost(host);
  }

}

export type EventsType = 'all' | 'my' | 'connections';
