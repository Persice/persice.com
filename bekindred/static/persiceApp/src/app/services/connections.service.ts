/// <reference path="../../typings/_custom.d.ts" />

import {provide, Inject, Injectable} from 'angular2/angular2';
import {Http} from 'angular2/http';

let API_URL = '/api/v1/connections/';


@Injectable()
export class ConnectionsService {
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


}

export var connectionsServiceInjectables: Array<any> = [
  provide(ConnectionsService, { useClass: ConnectionsService }),
  provide(API_URL, { useValue: API_URL })
];
