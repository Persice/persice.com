import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { Event, EventsType } from '../models/event';
import { HttpClient } from '../core/http-client';

interface EventsMapped {
  events: Event[];
  nextUrl: string;
}

@Injectable()
export class EventsService {
  public static API_URL = '/api/v1/events2/';

  public events$: Observable<Event[]>;
  public isLoading$: Observable<boolean>;
  public isLoadingInitial$: Observable<boolean>;
  public isLoaded$: Observable<boolean>;
  public notFound$: Observable<boolean>;

  private _events$: BehaviorSubject<Event[]> = new BehaviorSubject([]);
  private _isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _isLoadingInitial$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _isLoaded$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _notFound$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _nextUrl: string = '';

  constructor(protected http: HttpClient) {
    this.events$ = this._events$.asObservable();
    this.isLoading$ = this._isLoading$.asObservable();
    this.isLoadingInitial$ = this._isLoadingInitial$.asObservable();
    this.isLoaded$ = this._isLoaded$.asObservable();
    this.notFound$ = this._notFound$.asObservable();
  }

  public loadInitial(type: EventsType): void {
    this._getEvents(type, true);
  }

  public loadMore(type: EventsType): void {
    this._getEvents(type, false);
  }

  private _getEvents(type: EventsType, loadingInitial: boolean): void {

    if (!!this._isLoading$.getValue()) {
      return;
    }

    // Set API url and params
    const params: string = [
      `format=json`,
      `feed=${type}`,
      `limit=12`,
      `filter=true`,
      `offset=0`,
    ].join('&');

    let apiUrl = `${EventsService.API_URL}?${params}`;

    if (!!loadingInitial) {
      this._nextUrl = '';
      this._events$.next([]);
      this._isLoading$.next(false);
      this._isLoaded$.next(false);
      this._isLoadingInitial$.next(true);
      this._notFound$.next(false);
    }

    // If url param is set, use it for loading more events
    if (!!this._nextUrl) {
      apiUrl = this._nextUrl;
    }

    this._isLoading$.next(true);

    let subs$: Subscription = this.http.get(apiUrl)
      .map((res: Response) => this._mapResponse(res))
      .subscribe((data: EventsMapped) => {

        this._nextUrl = data.nextUrl;

        const eventsList: Event[] = [ ...this._events$.getValue(), ...data.events ];

        this._events$.next(eventsList);

        if (eventsList.length === 0) {
          this._notFound$.next(true);
        } else {
          this._notFound$.next(false);
        }

        if (this._nextUrl === null) {
          this._isLoaded$.next(true);
        }

        this._isLoadingInitial$.next(false);

      }, (err) => { // Error handler
        console.log('Could not load events');
        console.log(err);
        this._notFound$.next(true);
        this._isLoading$.next(false);
        this._isLoaded$.next(true);
      }, () => { // When finished
        this._isLoading$.next(false);
        subs$.unsubscribe();
      });
  }

  private _mapResponse(response: Response): EventsMapped {
    const dto: any = response.json();

    // Parse API response.
    let next: string = dto.meta.next;
    let eventsList: Event[] = dto.objects.map((data) => this._toEvent(data));

    return {
      events: eventsList,
      nextUrl: next
    };

  }

  //noinspection JSMethodCanBeStatic
  private _toEvent(dto: any): Event {
    return Event.fromDto(dto);
  }
}
