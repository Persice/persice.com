import { provide, Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import {HttpClient} from '../core/http_client';
import {Observable} from 'rxjs';
import {mergeMap} from 'rxjs/operator/mergeMap';

import {OPTS_REQ_JSON_CSRF} from '../core/http_constants';

import {remove, find} from 'lodash';

import {CookieUtil} from '../core/util';

const USER_ID = CookieUtil.getValue('userid');

@Injectable()
export class LocationService {
  static API_URL: string = '/api/v1/location/';

  static DEFAULT_LOCATION = {
    altitude: null,
    altitude_accuracy: null,
    heading: null,
    position: '0,0',
    speed: null,
    user: `/api/v1/auth/user/${USER_ID}/`
  };

  _location = {};

  constructor(private http: HttpClient) {

  }


  public get(): Observable<any> {

    let params: string = [
    `format=json`
    ].join('&');

    let url = `${LocationService.API_URL}?${params}`;

    return this.http.get(url).map((res: Response) => {
      let data = res.json();
      if (data.meta.total_count > 0) {
        this._location = data.objects[0];
      }

      return data;
    });
  }

  public geCurrent(): any {
    return this._location;
  }

  public updateLocation(loc): any {
    this._location = loc;
  }

  public updateOrCreate(loc): Observable<any> {
    let newLoc = {
      altitude: loc.coords.altitude,
      altitude_accuracy: loc.coords.altitudeAccuracy,
      heading: loc.coords.heading,
      position: `${loc.coords.latitude},${loc.coords.longitude}`,
      speed: loc.coords.speed,
      user: `/api/v1/auth/user/${USER_ID}/`
    };

    return this.get()
    .mergeMap((res) => {
      if (res.meta.total_count === 0) {

        return this.create(newLoc);
      }
      else {
        return this.update(res.objects[0].resource_uri, newLoc);
      }
    });

  }


  public update(resourceUri: string, data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.patch(
      `${resourceUri}?format=json`,
      body,
      OPTS_REQ_JSON_CSRF)
    .map((res: Response) => res.json());
  }

  public create(data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post(
      `${LocationService.API_URL}?format=json`,
      body,
      OPTS_REQ_JSON_CSRF)
    .map((res: Response) => res.json());
  }



}
export var locationServiceInjectables: Array<any> = [
provide(LocationService, { useClass: LocationService })
];
