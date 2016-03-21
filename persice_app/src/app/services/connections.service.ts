import { provide, Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import {Observable} from 'rxjs';

import {HttpClient} from '../core/http_client';

@Injectable()
export class ConnectionsService {
  static API_URL: string = '/api/v1/connections/';
  next: string = '';

  constructor(public http: HttpClient) {

  }

  public get(url: string, limit: number, filter: boolean): Observable<any> {

    if (url === '') {
      let params: string = [
        `format=json`,
        `limit=${limit}`,
        `filter=${filter}`,
        `offset=0`,
      ].join('&');

      this.next = `${ConnectionsService.API_URL}?${params}`;
    } else {
      this.next = url;
    }
    return this.http.get(this.next).map((res: Response) => res.json());
  }
}

export var connectionsServiceInjectables: Array<any> = [
  provide(ConnectionsService, { useClass: ConnectionsService })
];
