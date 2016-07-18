import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { Event } from '../../shared/model/event';

@Injectable()
export class EventMobileService {
  public static API_URL = '/api/v1/event/';

  public event$: Observable<Event>;
  public isLoading$: Observable<boolean>;
  public isLoaded$: Observable<boolean>;
  public notFound$: Observable<boolean>;

  private _event$: BehaviorSubject<Event> = new BehaviorSubject(<Event>{});
  private _isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _isLoaded$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _notFound$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(protected http: Http) {
    this.event$ = this._event$.asObservable();
    this.isLoading$ = this._isLoading$.asObservable();
    this.isLoaded$ = this._isLoaded$.asObservable();
    this.notFound$ = this._notFound$.asObservable();
  }

  public load(eventId: string): void {
    this._getEvent(eventId);
  }

  private _getEvent(eventId: string): void {

    if (!!this._isLoading$.getValue()) {
      return;
    }

    // Set API url and params
    const params: string = [
      `format=json`
    ].join('&');

    let apiUrl = `${EventMobileService.API_URL}${eventId}/?${params}`;

    this._isLoading$.next(true);

    let subs$: Subscription = this.http.get(apiUrl)
      .map((res: Response) => this._toEvent(res))
      .subscribe((data: Event) => {
        this._event$.next(data);
      }, (err) => { // Error handler
        console.log('Could not load event');
        console.log(err);
        this._notFound$.next(true);
        this._isLoading$.next(false);
        this._isLoaded$.next(false);
      }, () => { // When finished
        this._isLoaded$.next(true);
        this._isLoading$.next(false);
        this._notFound$.next(false);
        subs$.unsubscribe();
      });
  }

  private _toEvent(dto: any): Event {
    let event: Event = new Event(dto.json());
    return event;
  }
}
