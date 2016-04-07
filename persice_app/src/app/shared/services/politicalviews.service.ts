import {provide, Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Observable} from 'rxjs';

import {HttpClient} from '../core';
import {OPTS_REQ_JSON_CSRF} from '../core';
import {CookieUtil} from '../core';

@Injectable()
export class PoliticalViewsService {
  static API_URL: string = '/api/v1/political_view/';
  static API_URL_INDEX: string = '/api/v1/political_index/';
  next: string = '';

  constructor(private http: HttpClient) {

  }

  public my(url: string, limit: number): Observable<any> {

    if (url === '') {
      let params: string = [
        `format=json`,
        `limit=${limit}`,
        `offset=0`,
      ].join('&');

      this.next = `${PoliticalViewsService.API_URL}?${params}`;
    } else {
      this.next = url;
    }

    return this.http.get(this.next).map((res: Response) => res.json());
  }

  public getIndex(url: string, limit: number): Observable<any> {

    if (url === '') {
      let params: string = [
        `format=json`,
        `limit=${limit}`,
        `offset=0`,
      ].join('&');

      this.next = `${PoliticalViewsService.API_URL_INDEX}?${params}`;
    } else {
      this.next = url;
    }

    return this.http.get(this.next).map((res: Response) => res.json());
  }

  public getByUser(url: string, limit: number, user: any): Observable<any> {

    if (url === '') {
      let params: string = [
        `format=json`,
        `limit=${limit}`,
        `user_id=${user}`,
        `offset=0`,
      ].join('&');

      this.next = `${PoliticalViewsService.API_URL}?${params}`;
    } else {
      this.next = url;
    }

    return this.http.get(this.next).map((res: Response) => res.json());
  }

  public create(data: any): Observable<any> {
    let userId = CookieUtil.getValue('userid');
    let it = {
      political_index: data,
      user: `/api/v1/auth/user/${userId}/`
    };

    const body = JSON.stringify(it);
    return this.http.post(
      `${PoliticalViewsService.API_URL}?format=json`,
      body,
      OPTS_REQ_JSON_CSRF)
      .map((res: Response) => res.json());
  }

  public delete(uri): Observable<any> {
    return this.http.delete(
      `${uri}?format=json`,
      OPTS_REQ_JSON_CSRF)
      .map((res: Response) => res.json());
  }


}

export var politicalViewsServiceInjectables: Array<any> = [
  provide(PoliticalViewsService, { useClass: PoliticalViewsService })
];
