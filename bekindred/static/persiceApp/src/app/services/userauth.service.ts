import { provide, Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operator/map';
import { mergeMap } from 'rxjs/operator/mergeMap';

import {HttpClient} from '../core/http_client';
import {OPTS_REQ_JSON_CSRF} from '../core/http_constants';
import {CookieUtil} from '../core/util';


@Injectable()
export class UserAuthService {
  static API_URL: string = '/api/v1/auth/';
  constructor(private http: HttpClient) {

  }

  public get(): Observable<any> {

    let params = [
      `format=json`
    ].join('&');

    let url = `${UserAuthService.API_URL}?${params}`;

    return this.http.get(url)
      .map((res: Response) => {
        return res.json();
      });
  }

  public findOneByUri(resourceUri: string): Observable<any> {
    let uri = '';
    if (resourceUri === 'me') {
      let userId = CookieUtil.getValue('userid');
      uri = '/api/v1/auth/user/' + userId + '/';
    }
    else {
      uri = resourceUri;
    }

    return this.http.get(`${uri}?format=json`).map((res: Response) => res.json());
  }

  public updateOne(resourceUri: string, data: any): Observable<any> {
    const body = JSON.stringify(data);
    let uri = '';
    if (resourceUri === 'me') {
      let userId = CookieUtil.getValue('userid');
      uri = '/api/v1/auth/user/' + userId + '/';
    }
    else {
      uri = resourceUri;
    }

    return this.http.patch(
      `${uri}?format=json`,
      body,
      OPTS_REQ_JSON_CSRF)
      .map((res: Response) => res.json());
  }

}

export var userAuthServiceInjectables: Array<any> = [
  provide(UserAuthService, { useClass: UserAuthService })
];

