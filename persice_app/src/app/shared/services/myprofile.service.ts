import { provide, Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operator/map';
import { mergeMap } from 'rxjs/operator/mergeMap';

import {HttpClient} from '../core';
import {OPTS_REQ_JSON_CSRF} from '../core';
import {CookieUtil} from '../core';


@Injectable()
export class MyProfileService {
  static API_URL: string = '/api/v1/user_profile/';
  constructor(private http: HttpClient) {

  }

  public get(): Observable<any> {
    let userId = CookieUtil.getValue('userid');
    let url = `${MyProfileService.API_URL}${userId}/?format=json`;
    return this.http.get(url)
    .map((res: Response) => {
      return res.json();
    });
  }


  public update(data): Observable<any> {
    let userId = CookieUtil.getValue('userid');
    let url = `${MyProfileService.API_URL}${userId}/?format=json`;
    let body = JSON.stringify(data);
    return this.http.patch(url, body, OPTS_REQ_JSON_CSRF)
    .map((res: Response) => res.json());
  }

}

export var myProfileServiceInjectables: Array<any> = [
provide(MyProfileService, { useClass: MyProfileService })
];
