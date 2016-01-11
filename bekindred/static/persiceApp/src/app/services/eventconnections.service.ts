import { provide, Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';

import * as Rx from 'rxjs';
import {Observable} from 'rxjs';

import {HttpClient} from '../core/http_client';

@Injectable()
export class EventConnectionsService {
  static API_URL: string = '/api/v1/events/connections/';
  next: string = '';

  constructor(private http: HttpClient) {

  }

  public get(url: string, limit: number, firstName: string): Observable<any> {

    if (url === '') {
      let params: string = [
        `format=json`,
        `limit=${limit}`,
        `first_name=${firstName}`,
        `offset=0`,
      ].join('&');

      let apiUrl = `${EventConnectionsService.API_URL}`;
      this.next = `${apiUrl}?${params}`;
    } else {
      this.next = url;
    }

    return this.http.get(this.next).map((res: Response) => res.json());
  }

}

export var eventConnectionsServiceInjectables: Array<any> = [
  provide(EventConnectionsService, { useClass: EventConnectionsService })
];
