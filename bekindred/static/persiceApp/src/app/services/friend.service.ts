/// <reference path="../../typings/_custom.d.ts" />

import {provide, Inject, Injectable} from 'angular2/angular2';
import {Http, Headers, RequestOptions} from 'angular2/http';

let API_URL = '/api/v1/friends/';


@Injectable()
export class FriendService {
  next: string = '';
  constructor(
    public http: Http,
    @Inject(API_URL) private apiUrl: string
  ) {

  }

  public get(url: string, limit: number, version: string, filter: boolean) {

    if (url === '') {
      let params: string = [
        `format=json`,
        `limit=${limit}`,
        `filter=${filter}`,
        `offset=0`,
      ].join('&');

      this.next = `${this.apiUrl}?${params}`;
    } else {
      this.next = url;
    }

    return this.http.get(this.next);
  }

  public saveFriendship(status: number, friendId: number) {
    let headers: Headers = new Headers();
    let csrftoken = this.getCookieValue('csrftoken');
    let userId = this.getCookieValue('userid');
    headers.append('X-CSRFToken', csrftoken);
    headers.append('Content-Type', 'application/json');

    let opts: RequestOptions = new RequestOptions();
    opts.headers = headers;

    let friendship = {
      friend1: '/api/v1/auth/user/' + userId + '/',
      friend2: '/api/v1/auth/user/' + friendId + '/',
      status: status
    };

    return this.http.post(this.apiUrl, JSON.stringify(friendship), opts);

  }


  private getCookieValue(name) {
    let value = '; ' + document.cookie;
    let parts = value.split('; ' + name + '=');
    if (parts.length === 2) return parts.pop().split(';').shift();
  }



}

export var friendServiceInjectables: Array<any> = [
  provide(FriendService, { useClass: FriendService }),
  provide(API_URL, { useValue: API_URL })
];
