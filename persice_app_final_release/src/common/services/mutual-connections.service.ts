import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient } from '../core/http-client';
import { Person } from '../models/person/person';
import { SocialProfile } from '../models/social-profile/social-profile';

interface Connections {
  mutual: any[];
  mutualTotalCount: number;
  others: any[];
  othersTotalCount: number;
}

interface ConnectionsPreview {
  connections: any[];
  connectionsTotalCount: number;
}

interface ConnectionsMapped {
  mutual: any[];
  others: any[];
  nextUrl: string;
}

interface ConnectionsPreviewMapped {
  connections: any[];
  connectionsTotalCount: number;
}

@Injectable()
export class MutualConnectionsService {
  public static API_URL = '/api/v2/mutual-connections/';

  public connections$: Observable<Connections>;
  public preview$: Observable<ConnectionsPreview>;
  public isLoading$: Observable<boolean>;
  public isLoaded$: Observable<boolean>;

  public counters$: Observable<number[]>;

  private _connections$: BehaviorSubject<Connections> = new BehaviorSubject({
    mutual: [],
    mutualTotalCount: 0,
    others: [],
    othersTotalCount: 0
  });
  private _preview$: BehaviorSubject<ConnectionsPreview> = new BehaviorSubject({
    connections: [],
    connectionsTotalCount: 0
  });
  private _isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _isLoaded$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _nextUrl: string = '';

  constructor(protected http: HttpClient) {
    this.connections$ = this._connections$.asObservable();
    this.preview$ = this._preview$.asObservable();
    this.isLoading$ = this._isLoading$.asObservable();
    this.isLoaded$ = this._isLoaded$.asObservable();

  }

  public loadInitial(userId: string): void {
    this._getConnections(userId, true);
  }

  public loadMore(userId: string): void {
    this._getConnections(userId, false);
  }

  public getForPreview(userId: string, limit: number): void {

    // Set API url and params
    const params: string = [
      `format=json`,
      `user_id=${userId}`,
      `offset=0`,
      `limit=${limit}`
    ].join('&');

    let apiUrl = `${MutualConnectionsService.API_URL}?${params}`;

    let subs$: Subscription = this.http.get(apiUrl)
      .map((res: Response) => this._mapResponsePreview(res))
      .subscribe((data: ConnectionsPreviewMapped) => {

        const previewList: any[] = [ ...data.connections ];

        this._preview$.next({
          connections: previewList,
          connectionsTotalCount: data.connectionsTotalCount
        });

      }, (err) => { // Error handler
        console.log('Could not load connections for preview');
        console.log(err);
      }, () => { // When finished
        subs$.unsubscribe();
      });
  }

  public get(userId: string, limit: number): Observable<any> {
    const params: string = [
      `format=json`,
      `user_id=${userId}`,
      `offset=0`,
      `limit=${limit}`
    ].join('&');

    let url = `${MutualConnectionsService.API_URL}?${params}`;

    return this.http.get(url).map((res: Response) => res.json());
  }

  private _getConnections(userId: string, loadingInitial: boolean): void {

    if (!!this._isLoading$.getValue()) {
      return;
    }

    // Set API url and params
    const params: string = [
      `format=json`,
      `user_id=${userId}`,
      `limit=12`,
      `offset=0`
    ].join('&');

    let apiUrl = `${MutualConnectionsService.API_URL}?${params}`;

    if (!!loadingInitial) {
      this._nextUrl = '';
      this._connections$.next({
        mutual: [],
        mutualTotalCount: 0,
        others: [],
        othersTotalCount: 0
      });
      this._isLoading$.next(false);
      this._isLoaded$.next(false);
    }

    // If url param is set, use it for loading more connections
    if (!!this._nextUrl) {
      apiUrl = this._nextUrl;
    }

    this._isLoading$.next(true);

    let subs$: Subscription = this.http.get(apiUrl)
      .map((res: Response) => this._mapResponse(res))
      .subscribe((data: ConnectionsMapped) => {

        this._nextUrl = data.nextUrl;

        const mutualList: any[] = [ ...this._connections$.getValue().mutual, ...data.mutual ];
        const othersList: any[] = [ ...this._connections$.getValue().others, ...data.others ];

        this._connections$.next({
          mutual: mutualList,
          mutualTotalCount: mutualList.length,
          others: othersList,
          othersTotalCount: othersList.length,
        });

        if (this._nextUrl === null) {
          this._isLoaded$.next(true);
        }

      }, (err) => { // Error handler
        console.log('Could not load connections');
        console.log(err);
      }, () => { // When finished
        this._isLoading$.next(false);
        subs$.unsubscribe();
      });
  }

  private _mapResponse(response: Response): ConnectionsMapped {
    const dto: any = response.json();

    // Parse API response.
    let next: string = dto.meta.next;
    let personsList: any[] = dto.objects.map((data) => this._toEntity(data));

    // Split persons in two lists (others and connections),
    // based on value of "mutual" attribute.
    let mutualList: any[] = [];
    let othersList: any[] = [];
    for (let i = 0; i < personsList.length; i++) {
      if (!!personsList[ i ].mutual) {
        mutualList = [ ...mutualList, personsList[ i ] ];
      } else {
        othersList = [ ...othersList, personsList[ i ] ];
      }
    }

    let data: ConnectionsMapped = {
      mutual: mutualList,
      others: othersList,
      nextUrl: next
    };

    return data;

  }

  private _mapResponsePreview(response: Response): ConnectionsPreviewMapped {
    const dto: any = response.json();

    // Parse API response.
    let totalCount: number = dto.meta.total_count;
    let personsList: any[] = dto.objects.map((data) => this._toEntity(data));

    let data: ConnectionsPreviewMapped = {
      connections: personsList,
      connectionsTotalCount: totalCount
    };

    return data;

  }

  private _toEntity(dto: any): any {
    let person: any;

    person = (dto.user_type === 'persice') ? this._toPerson(dto) : this._toSocialProfile(dto);
    return person;
  }

  private _toPerson(dto: any): Person {
    let person: Person = new Person(dto);
    return person;
  }

  private _toSocialProfile(dto: any): SocialProfile {
    let person: SocialProfile = new SocialProfile(dto);
    return person;
  }
}
