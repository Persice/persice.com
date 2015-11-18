/// <reference path="../../typings/_custom.d.ts" />

import {provide, Injectable, Observable} from 'angular2/angular2';
import {Http, Response} from 'angular2/http';


@Injectable()
export class EventsService {
  static API_URL: string = '/api/v1/feed/events/my/';
  next: string = '';

  constructor(private http: Http) {

  }

  public get(url: string, limit: number, filter: boolean): Observable<any> {

    if (url === '') {
      let params: string = [
        `format=json`,
        `limit=${limit}`,
        `filter=${filter}`,
        `offset=0`,
      ].join('&');

      this.next = `${EventsService.API_URL}?${params}`;
    }
    else {
      this.next = url;
    }

    return this.http.get(this.next).map((res: Response) => res.json());
  }


}

export var eventsServiceInjectables: Array<any> = [
  provide(EventsService, { useClass: EventsService })
];
