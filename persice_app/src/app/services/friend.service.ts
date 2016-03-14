import { provide, Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operator/map';

import {HttpClient} from '../core/http_client';


import {OPTS_REQ_JSON_CSRF} from '../core/http_constants';
import {CookieUtil} from '../core/util';


@Injectable()
export class FriendService {
  static API_URL: string = '/api/v1/friends/';
  next: string = '';
  constructor(private http: HttpClient) {

  }

  public get(url: string, limit: number): Observable<any> {

    if (url === '') {
      let params: string = [
        `format=json`,
        `limit=${limit}`,
        `offset=0`,
      ].join('&');

      this.next = `${FriendService.API_URL}?${params}`;
    } else {
      this.next = url;
    }

    return this.http.get(this.next).map((res: Response) => res.json());
  }

  public saveFriendship(status: number, friendId: number): Observable<any> {
    let userId = CookieUtil.getValue('userid');
    let friendship = {
      friend1: '/api/v1/auth/user/' + userId + '/',
      friend2: '/api/v1/auth/user/' + friendId + '/',
      status: status
    };
    let body = JSON.stringify(friendship);
    return this.http.post(`${FriendService.API_URL}?format=json`, body, OPTS_REQ_JSON_CSRF)
      .map((res: Response) => res.json());
  }
}

export var friendServiceInjectables: Array<any> = [
  provide(FriendService, { useClass: FriendService })
];
