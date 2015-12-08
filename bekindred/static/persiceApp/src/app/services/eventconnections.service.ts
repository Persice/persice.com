/// <reference path="../../typings/_custom.d.ts" />

import { provide, Injectable } from 'angular2/angular2';
import { Http, Response } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operator/map';
import { mergeMap } from 'rxjs/operator/mergeMap';

Observable.prototype.map = map;
Observable.prototype.flatMap = mergeMap;

@Injectable()
export class EventConnectionsService {
  static API_URL: string = '/api/v1/events/connections/';
  next: string = '';

  constructor(private http: Http) {

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
    }
    else {
      this.next = url;
    }

    return this.http.get(this.next).map((res: Response) => res.json());
  }

}

export var eventConnectionsServiceInjectables: Array<any> = [
  provide(EventConnectionsService, { useClass: EventConnectionsService })
];
