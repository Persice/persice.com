import {provide, Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import * as Rx from 'rxjs';
import {Observable} from 'rxjs';

import {HttpClient} from '../core/http_client';

@Injectable()
export class ReligiousViewsService {
  static API_URL: string = '/api/v1/religious_view/';
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

      this.next = `${ReligiousViewsService.API_URL}?${params}`;
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

      this.next = `${ReligiousViewsService.API_URL}?${params}`;
    } else {
      this.next = url;
    }

    return this.http.get(this.next).map((res: Response) => res.json());
  }


}

export var religiousViewsServiceInjectables: Array<any> = [
  provide(ReligiousViewsService, { useClass: ReligiousViewsService })
];
