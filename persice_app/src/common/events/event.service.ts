import { Injectable } from '@angular/core';
import { Response, Headers } from '@angular/http';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { Event } from '../models/event/index';
import { HttpClient } from '../core/http-client';
import { TokenUtil, FormUtil } from '../core/util';
import { UserService } from '../../app/shared/services/user.service';

@Injectable()
export class EventService {
  public static API_URL = '/api/v1/event/';

  public event$: Observable<Event>;
  public isLoading$: Observable<boolean>;
  public isImageUploading$: Observable<boolean>;
  public isLoaded$: Observable<boolean>;
  public notFound$: Observable<boolean>;

  private _event$: BehaviorSubject<Event> = new BehaviorSubject(<Event>{});
  private _isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _isLoaded$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _isImageUploading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _notFound$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(protected http: HttpClient, private serviceUser: UserService) {
    this.event$ = this._event$.asObservable();
    this.isLoading$ = this._isLoading$.asObservable();
    this.isImageUploading$ = this._isImageUploading$.asObservable();
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

    let apiUrl = `${EventService.API_URL}${eventId}/?${params}`;

    this._isLoading$.next(true);

    let subs$: Subscription = this.http.get(apiUrl)
      .map((res: Response) => this._toEvent(res))
      .subscribe((event: Event) => {
        this._event$.next(event);
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

  public updateImageByUri(data, resourceUri): void {
    let userId = TokenUtil.getValue('user_id');
    let event = data;
    event.user = '/api/v1/auth/user/' + userId + '/';
    let options = {headers: new Headers()};
    options.headers.set('Content-Type', 'multipart/form-data');
    let body = FormUtil.formData(event);

    this._isImageUploading$.next(true);
    this.http.put(`${resourceUri}?format=json`, <any>body, options)
      .map((res: Response) => this._toEvent(res))
      .subscribe((data: Event) => {
        this._isImageUploading$.next(false);
        this._event$.next(data);
      }, (err) => {
        console.log('Image upload went wrong')
        console.log(err);
      });
  }

  private _toEvent(dto: any): Event {
    let event: Event = new Event(dto.json());

    return event;
  }
}
