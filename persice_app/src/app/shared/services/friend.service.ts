import {provide, Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {Observable} from 'rxjs';
import {OPTS_REQ_JSON_CSRF, CookieUtil, HttpClient} from '../core';

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
