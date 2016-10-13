import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '../../../../common/core/http-client';
import { EventInterest } from '../../../../common/models/event/event_interest.model';

@Injectable()
export class EventInterestsService {
  public static API_URL = '/api/v2/shared_interests/';

  public interests$: Observable<EventInterest[]>;
  public count$: Observable<number>;
  public isLoading$: Observable<boolean>;
  public isLoaded$: Observable<boolean>;

  private _interests$: BehaviorSubject<EventInterest[]> = new BehaviorSubject([]);
  private _count$: BehaviorSubject<number> = new BehaviorSubject(0);
  private _isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _isLoaded$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _nextUrl: string = '';

  constructor(protected http: HttpClient) {
    this.interests$ = this._interests$.asObservable();
    this.count$ = this._count$.asObservable();
    this.isLoading$ = this._isLoading$.asObservable();
    this.isLoaded$ = this._isLoaded$.asObservable();
  }

  public loadCount(eventId: any): void {
    this._getCount(eventId);
  }

  public loadInitial(interestType: string, eventId: number): void {
    this._getInterests(interestType, eventId, true);
  }

  public loadMore(interestType: string, eventId: number): void {
    this._getInterests(interestType, eventId, false);
  }

  private _getCount(eventId: number): void {

    const params: string = [
      `format=json`,
      `only_my=false`
    ].join('&');

    let apiUrl = `${EventInterestsService.API_URL}${eventId}/?${params}`;

    this._count$.next(0);

     let subs$: Subscription = this.http.get(apiUrl)
      .map((res: Response) => this._mapCount(res))
      .subscribe((data: number) => {

        this._count$.next(data);

      }, (err) => { // Error handler

      }, () => { // When finished

        subs$.unsubscribe();
      });

  }

  private _getInterests(interestType: string, eventId: number, loadingInitial: boolean): void {

    if (!!this._isLoading$.getValue()) {
      return;
    }

    let interestTypeParam = interestType === 'my' ? 'only_my=true' : 'only_my=false';

    // Set API url and params
    const params: string = [
      `format=json`,
      `${interestTypeParam}`
    ].join('&');

    let apiUrl = `${EventInterestsService.API_URL}${eventId}/?${params}`;

    if (!!loadingInitial) {

      this._nextUrl = '';
      this._interests$.next([]);
      this._isLoading$.next(false);
      this._isLoaded$.next(false);
    }

    // If url param is set, use it for loading more attendees
    if (!!this._nextUrl) {
      apiUrl = SERVER_URI + this._nextUrl;
    }

    this._isLoading$.next(true);

    let subs$: Subscription = this.http.get(apiUrl)
      .map((res: Response) => this._mapResponse(res))
      .subscribe((data: any) => {

        this._nextUrl = data.nextUrl;

        const interestsList: EventInterest[] = [...this._interests$.getValue(), ...data.interests];

        this._interests$.next(interestsList);

        if (this._nextUrl === null) {
          this._isLoaded$.next(true);
        }

      }, (err) => { // Error handler
        this._isLoading$.next(false);
        this._isLoaded$.next(false);
      }, () => { // When finished
        this._isLoading$.next(false);
        subs$.unsubscribe();
      });
  }

  private _mapResponse(response: Response): any {
    const dto: any = response.json();

    // Parse API response.
    let interestsList: EventInterest[] = dto.shared_interests ? dto.shared_interests.map((data) => this._toInterest(data)) : [];

    return {
      interests: interestsList,
      nextUrl: null
    };

  }

  private _mapCount(response: Response): number {
    const dto: any = response.json();

    // Parse API response.
    let count: number = dto.total_count ? dto.total_count : 0;
    return count;

  }

  private _toInterest(dto: any): EventInterest {
    let interest: EventInterest = new EventInterest(dto);
    return interest;
  }
}
