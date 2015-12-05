/// <reference path="../../typings/_custom.d.ts" />

import {provide, Injectable, Observable} from 'angular2/angular2';
import {Http, Response} from 'angular2/http';


@Injectable()
export class EventsService {
  static API_URL_MY_EVENTS: string = '/api/v1/feed/events/my/';
  static API_URL_MY_NETWORK: string = '/api/v1/feed/events/friends/';
  static API_URL_ALL: string = '/api/v1/feed/events/all/';
  static NEW_API: string = '/api/v1/events2/';
  next: string = '';

  constructor(private http: Http) {

  }

  public get(url: string, limit: number, filter: boolean, type: string): Observable<any> {

    if (url === '') {

      let newtype = '';
      switch (type) {
        case 'my':
          newtype = 'my';
          break;
        case 'all':
          newtype = 'all';
          break;
        case 'network':
          newtype = 'connections';
          break;

        default:
          break;
      }

      let params: string = [
        `format=json`,
        `feed=${newtype}`,
        `limit=${limit}`,
        `filter=${filter}`,
        `offset=0`,
      ].join('&');
      let apiUrl = `${EventsService.NEW_API}`;

      // let params: string = [
      //   `format=json`,
      //   `limit=${limit}`,
      //   `filter=${filter}`,
      //   `offset=0`,
      // ].join('&');

      // let apiUrl = '';
      // switch (type) {
      //   case 'my':
      //     apiUrl = `${EventsService.API_URL_MY_EVENTS}`;
      //     break;
      //   case 'all':
      //     apiUrl = `${EventsService.API_URL_ALL}`;
      //     break;
      //   case 'network':
      //     apiUrl = `${EventsService.API_URL_MY_NETWORK}`;
      //     break;
      //   default:
      //     break;
      // }

      this.next = `${apiUrl}?${params}`;
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
