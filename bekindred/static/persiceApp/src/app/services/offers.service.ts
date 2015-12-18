import { provide, Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operator/map';

import {HttpClient} from '../core/http_client';

import {OPTS_REQ_JSON_CSRF} from '../core/http_constants';
import {CookieUtil} from '../core/util';

@Injectable()
export class OffersService {
  static API_URL: string = '/api/v1/offer/';
  next: string = '';

  constructor(private http: HttpClient) {
  }

  public get(url: string, limit: number): Observable<any> {
    let userId = CookieUtil.getValue('userid');
    if (url === '') {
      let params: string = [
        `format=json`,
        `limit=${limit}`,
        `user_id=${userId}`,
        `offset=0`,
      ].join('&');

      this.next = `${OffersService.API_URL}?${params}`;
    }
    else {
      this.next = url;
    }

    return this.http.get(this.next).map((res: Response) => res.json());
  }

  public save(subject: string): Observable<any> {
    let userId = CookieUtil.getValue('userid');
    let interest = {
      offer_subject: subject,
      user: '/api/v1/auth/user/' + userId + '/'
    };
    let body = JSON.stringify(interest);
    return this.http.post(`${OffersService.API_URL}?format=json`, body, OPTS_REQ_JSON_CSRF)
      .map((res: Response) => res.json());
  }

  public delete(url: string): Observable<any> {
    return this.http.delete(`${url}?format=json`, OPTS_REQ_JSON_CSRF)
      .map((res: Response) => res.json());
  }

}

export var offersServiceInjectables: Array<any> = [
  provide(OffersService, { useClass: OffersService })
];

