import { Injectable } from '@angular/core';
import { Response, Headers } from '@angular/http';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { Event } from '../models/event/index';
import { HttpClient } from '../core/http-client';
import { TokenUtil, FormUtil } from '../core/util';
import { EventValidator } from './event-validator';

@Injectable()
export class EventService {
  public static API_URL = '/api/v1/event/';

  private validationErrors = {};

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

  constructor(protected http: HttpClient) {
    this.event$ = this._event$.asObservable();
    this.isLoading$ = this._isLoading$.asObservable();
    this.isImageUploading$ = this._isImageUploading$.asObservable();
    this.isLoaded$ = this._isLoaded$.asObservable();
    this.notFound$ = this._notFound$.asObservable();
  }

  public load(eventId: string): void {
    this._getEvent(eventId);
  }

  public updateImageByUri(data, resourceUri): void {
    let image = data;
    let userId = TokenUtil.getValue('user_id');
    image.user = '/api/v1/auth/user/' + userId + '/';
    let body = FormUtil.formData(image);

    let options = {headers: new Headers()};
    options.headers.set('Content-Type', 'multipart/form-data');

    this._isImageUploading$.next(true);
    this.http.put(`${resourceUri}?format=json`, <any>body, options)
      .map((res: Response) => this._toEvent(res))
      .subscribe((data: Event) => {
        this._isImageUploading$.next(false);
        this._event$.next(data);
      }, (err) => {
        console.log('Image upload went wrong');
        console.log(err);
      });
  }

  public create(e: Event): Observable<any> {
    let event = e.exportData();

    let userId = TokenUtil.getValue('user_id');
    event.user = '/api/v1/auth/user/' + userId + '/';

    //fix location if not found by autocomplete
    if (event.location === '' || event.location === undefined || event.location === null) {
      event.location = '0,0';
      event.location_name = event.eventLocation;
    }

    let body = FormUtil.formData(event);

    return Observable.create(observer => {
      if (!this._validateData(e)) {
        observer.error({
          validationErrors: this.validationErrors
        });
      } else {
        let options = {headers: new Headers()};
        options.headers.set('Content-Type', 'multipart/form-data');
        this.http.post(`${EventService.API_URL}?format=json`, <any>body, options).map((res: Response) => res.json())
          .subscribe((res) => {
            observer.next(res);
            observer.complete();
          }, (err) => {
            observer.error(err);
          });
      }
    });
  }

  public deleteByUri(resourceUri: string): Observable<any> {
    return this.http.delete(`${resourceUri}?format=json`);
  }

  public updateByUri(e: Event): Observable<any> {
    let event = e.exportData();

    let userId = TokenUtil.getValue('user_id');
    event.user = '/api/v1/auth/user/' + userId + '/';

    //fix location if not found by autocomplete
    if (event.location === '' || event.location === undefined || event.location === null) {
      event.location = '0,0';
      event.location_name = event.eventLocation;
    }

    let body = FormUtil.formData(event);

    return Observable.create(observer => {
      if (!this._validateData(e)) {
        observer.error({
          validationErrors: this.validationErrors
        });
      } else {
        let options = { headers: new Headers() };
        options.headers.set('Content-Type', 'multipart/form-data');
        this.http.put(`${e.resourceUri}?format=json`, <any>body, options).map((res: Response) => res.json())
          .subscribe((res) => {
            observer.next(res);
            observer.complete();
          }, (err) => {
            observer.error(err);
          });
      }
    });
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

  private _toEvent(dto: any): Event {
    return Event.fromDto(dto.json());
  }

  private _validateData(event: Event): boolean {
    this.validationErrors = {};
    let errors = new EventValidator().validateData(event);
    this.validationErrors = errors;

    if (this.validationErrors && Object.keys(this.validationErrors).length > 0) {
      return false;
    } else {
      return true;
    }
  }
}
