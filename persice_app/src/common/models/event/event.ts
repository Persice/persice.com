import { Distance } from '../distance';
import { DateUtil, ListUtil, TokenUtil } from '../../core/util';
import { EventDate } from './event-date';
import { EventHost } from './event-host';
import {Location} from "./location";

export class Event {
  private _id: string;
  private _type: string;
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
  private _eventUrl: string;
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
  private _mergedAddress: string;
  private _country: string;
  private _city: string;
  private _zipcode: string;
  private _state: string;
  private _street: string;
  private _address: string;
  private _eventLocation: string;
  private _startDate: EventDate;
  private _endDate: EventDate;
  private _startDateRaw: string;
  private _endDateRaw: string;
  private _resourceUri: string;
  private _eventHost: EventHost;
  private _isHost: boolean;

  constructor() {}

  public static fromDto(dto: any): Event {
    let event: Event = new Event();
    event.initFromDto(dto);

    return event;
  }

  public static empty(): Event {
    let event: Event = new Event();

    return event;
  }

  private initFromDto(dto: any): void {
    this._id = dto.id;
    this._type = dto.event_type ? dto.event_type : 'persice';
    this._name = dto.name;
    this._image = !!dto.event_photo && dto.event_photo !== 'https://d2v6m3k9ul63ej.cloudfront.net/null' ? dto.event_photo : '/assets/images/placeholder-image.png';
    this._eventUrl = dto.event_url;
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
    this._locationName = dto.location_name ? dto.location_name : '';
    this._fullAddress = dto.full_address ? dto.full_address : '';
    this._mergedAddress = this._fullAddress ? this._fullAddress : this._locationName;
    if (this._fullAddress && this._locationName && this._fullAddress.indexOf(this._locationName) === -1) {
      this._mergedAddress = this._locationName + ', ' + this._fullAddress;
    }
    this._eventLocation = this._mergedAddress;
    this._country = dto.country;
    this._city = dto.city;
    this._zipcode = dto.zipcode;
    this._state = dto.state;
    this._startDate = this._parseEventDateFromField(dto.starts_on);
    this._endDate = this._parseEventDateFromField(dto.ends_on);
    this._startDateRaw = dto.starts_on;
    this._endDateRaw = dto.ends_on;
    this._locationRaw = dto.location ? dto.location : '0,0';
    this._resourceUri = dto.resource_uri;
    this._latitude = dto.location ? dto.location.split(',')[0] : '0';
    this._longitude = dto.location ? dto.location.split(',')[1] : '0';
    this._mapUrl = `https://www.google.com/maps/place/${this._latitude}+${this._longitude}/@${this._latitude},${this._longitude},15z`;

    this._eventHost = dto.organizer ? new EventHost(dto.organizer) : null;
    this._hostedBy = this._eventHost ? this._eventHost.name : '';
    this._isHost = this._eventHost ? (this._eventHost.username === TokenUtil.getValue('username') ? true : false) : false;
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

  public updateLocation(location: Location): void {
    this.street = location.street;
    this.zipcode = location.zipcode;
    this.state = location.state;
    this.address = location.address;
    this.fullAddress = location.full_address;
    this.city = location.city;
    this.country = location.country;
    this.locationRaw = location.location;
    this.locationName = location.location_name;
  }

  public exportData(): any {
    return {
      name: this.name,
      description: this.description,
      access_level: 'public',
      starts_on: this.startDateRaw,
      ends_on: this.endDateRaw,
      repeat: 'w',
      event_photo: '',
      street: this.street,
      city: this.city,
      zipcode: this.zipcode || '',
      state: this.state,
      full_address: this.fullAddress,
      location_name: this.locationName,
      country: this.country,
      address: this.address || this.fullAddress,
      location: this.locationRaw,
      max_attendees: this.maxAttendees
    }
  }

  public get isHost(): boolean {
    return this._isHost;
  }

  get name(): string {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }

  get type(): string {
    return this._type;
  }

  get eventUrl(): string {
    return this._eventUrl;
  }

  set eventUrl(eventUrl: string) {
    this._eventUrl = eventUrl;
  }

  get id(): string {
    return this._id;
  }

  get image(): string {
    return this._image;
  }

  set image(image: string) {
    this._image = image;
  }

  get hostedBy(): string {
    return this._hostedBy;
  }

  get description(): string {
    return this._description;
  }

  set description(description: string) {
    this._description = description;
  }

  get accessLevel(): string {
    return this._accessLevel;
  }

  set accessLevel(accessLevel: string) {
    this._accessLevel = accessLevel;
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

  set maxAttendees(maxAttendees: number) {
    this._maxAttendees = maxAttendees;
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

  set locationName(locationName: string) {
    this._locationName = locationName;
  }

  get fullAddress(): string {
    return this._fullAddress;
  }

  set fullAddress(fullAddress: string) {
    this._fullAddress = fullAddress;
  }

  get mergedAddress(): string {
    return this._mergedAddress;
  }

  get country(): string {
    return this._country;
  }

  set country(country: string) {
    this._country = country;
  }

  get city(): string {
    return this._city;
  }

  set city(city: string) {
    this._city = city;
  }

  get zipcode(): string {
    return this._zipcode;
  }

  set zipcode(zipcode: string) {
    this._zipcode = zipcode;
  }

  get state(): string {
    return this._state;
  }

  set state(state: string) {
    this._state = state;
  }

  get street(): string {
    return this._street;
  }

  set street(street: string) {
    this._street = street;
  }

  get eventLocation(): string {
    return this._eventLocation;
  }

  set eventLocation(eventLocation: string) {
    this._eventLocation = eventLocation;
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

  set startDateRaw(startDateRow: string) {
    this._startDateRaw = startDateRow;
  }

  get endDateRaw(): string {
    return this._endDateRaw;
  }

  set endDateRaw(endDateRow: string) {
    this._endDateRaw = endDateRow;
  }

  get locationRaw(): string {
    return this._locationRaw;
  }

  set locationRaw(locationRaw: string) {
    this._locationRaw = locationRaw;
  }

  get address(): string {
    return this._address;
  }

  set address(address: string) {
    this._address = address;
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

}

export type EventsType = 'all' | 'my' | 'connections';
