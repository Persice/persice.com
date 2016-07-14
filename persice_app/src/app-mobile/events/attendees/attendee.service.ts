import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { Person } from '../../shared/model/person';

enum RsvpStatus {
  yes = 1,
  maybe = 2,
  no = 3
}

interface Attendees {
  connections: Person[];
  connectionsTotalCount: number;
  others: Person[];
  othersTotalCount: number;
}

interface AttendeesMapped {
  connections: Person[];
  others: Person[];
  nextUrl: string;
}

@Injectable()
export class AttendeeService {
  public static API_URL = '/api/v2/attendees/';

  public attendees$: Observable<Attendees>;
  public isLoading$: Observable<boolean>;
  public isLoaded$: Observable<boolean>;

  public counters$: Observable<number[]>;

  private _attendees$: BehaviorSubject<Attendees> = new BehaviorSubject({
    connections: [],
    connectionsTotalCount: 0,
    others: [],
    othersTotalCount: 0
  });
  private _isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _isLoaded$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _nextUrl: string = '';

  private _counters$: BehaviorSubject<number[]> = new BehaviorSubject([0, 0, 0]);

  constructor(protected http: Http) {
    this.attendees$ = this._attendees$.asObservable();
    this.isLoading$ = this._isLoading$.asObservable();
    this.isLoaded$ = this._isLoaded$.asObservable();

    this.counters$ = this._counters$.asObservable();

  }

  public getCounters(eventId: number): void {
    let subs: Subscription = Observable.forkJoin(
      this._getCounters(RsvpStatus.yes, eventId),
      this._getCounters(RsvpStatus.maybe, eventId),
      this._getCounters(RsvpStatus.no, eventId))
      .subscribe((data: number[]) => {
        this._counters$.next(data);
        subs.unsubscribe();
      });
  }

  public loadInitial(rsvp: any, eventId: number): void {
    this._getAttendees(rsvp, eventId, true);
  }

  public loadMore(rsvp: any, eventId: number): void {
    this._getAttendees(rsvp, eventId, false);
  }

  private _getCounters(rsvp: RsvpStatus, eventId: number): Observable<any> {
    const params: string = [
      `format=json`,
      `rsvp=${RsvpStatus[rsvp]}`,
      `event_id=${eventId}`,
      `limit=1`,
      `offset=0`
    ].join('&');

    const apiUrl = `${AttendeeService.API_URL}?${params}`;

    return this.http.get(apiUrl).map((response: Response) => this._mapTotalCount(response));
  }

  private _mapTotalCount(response: Response): number {
    let totalCount: number = 0;

    let dto: any = response.json();
    if (!!dto.meta) {
      totalCount = dto.meta.total_count;
    }

    return totalCount;
  }

  private _getAttendees(rsvp: any, eventId: number, loadingInitial: boolean): void {

    if (!!this._isLoading$.getValue()) {
      return;
    }

    // Set API url and params
    const params: string = [
      `format=json`,
      `rsvp=${RsvpStatus[rsvp]}`,
      `event_id=${eventId}`,
      `limit=12`,
      `offset=0`
    ].join('&');

    let apiUrl = `${AttendeeService.API_URL}?${params}`;

    if (!!loadingInitial) {
      this._nextUrl = '';
      this._attendees$.next({
        connections: [],
        connectionsTotalCount: 0,
        others: [],
        othersTotalCount: 0
      });
      this._isLoading$.next(false);
      this._isLoaded$.next(false);
    }

    // If url param is set, use it for loading more attendees
    if (!!this._nextUrl) {
      apiUrl = this._nextUrl;
    }

    this._isLoading$.next(true);

    let subs$: Subscription = this.http.get(apiUrl)
      .map((res: Response) => this._mapResponse(res))
      .subscribe((data: AttendeesMapped) => {

        this._nextUrl = data.nextUrl;

        const connectionsList: Person[] = [...this._attendees$.getValue().connections, ...data.connections];
        const othersList: Person[] = [...this._attendees$.getValue().others, ...data.others];

        this._attendees$.next({
          connections: connectionsList,
          connectionsTotalCount: connectionsList.length,
          others: othersList,
          othersTotalCount: othersList.length,
        });

        if (this._nextUrl === null) {
          this._isLoaded$.next(true);
        }

      }, (err) => { // Error handler
        console.log('Could not load attendees');
        console.log(err);
      }, () => { // When finished
        this._isLoading$.next(false);
        subs$.unsubscribe();
      });
  }

  private _mapResponse(response: Response): AttendeesMapped {
    const dto: any = response.json();

    // Parse API response.
    let next: string = dto.meta.next;
    let personsList: Person[] = dto.objects.map((data) => this._toPerson(data));

    // Split persons in two lists (others and connections),
    // based on value of "connected" attribute.
    let connectionsList: Person[] = [];
    let othersList: Person[] = [];
    for (let i = 0; i < personsList.length; i++) {
      if (!!personsList[i].connected) {
        connectionsList = [...connectionsList, personsList[i]];
      } else {
        othersList = [...othersList, personsList[i]];
      }
    }

    let data: AttendeesMapped = {
      connections: connectionsList,
      others: othersList,
      nextUrl: next
    };

    return data;

  }

  private _toPerson(dto: any): Person {
    let person: Person = new Person(dto);
    return person;
  }
}
