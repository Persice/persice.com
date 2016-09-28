import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from '../core/http-client';
import { Observable } from 'rxjs/Observable';
import { TokenUtil } from '../core/util';

@Injectable()
export class LocationService {
  static API_URL: string = '/api/v1/location/';

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
        this._location = data.objects[ 0 ];
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
      user: `/api/v1/auth/user/${TokenUtil.getValue('user_id')}/`
    };

    return this.get()
      .mergeMap((res) => {
        if (res.meta.total_count === 0) {
          return this.create(newLoc);
        } else {
          return this.update(res.objects[ 0 ].resource_uri, newLoc);
        }
      });

  }

  public update(resourceUri: string, data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.patch(
      `${resourceUri}?format=json`,
      body)
      .map((res: Response) => res.json());
  }

  public create(data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post(
      `${LocationService.API_URL}?format=json`,
      body)
      .map((res: Response) => res.json());
  }
}

export interface UserLocation {
  altitude: string;
  altitude_accuracy: string;
  heading: string;
  position: string;
  speed: string;
  user: string;
}
