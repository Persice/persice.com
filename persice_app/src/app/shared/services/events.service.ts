import { provide, Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import {Observable} from 'rxjs';
import {HttpClient} from '../core';

@Injectable()
export class EventsService {
  static NEW_API: string = '/api/v1/events2/';
  next: string = '';

  constructor(private http: HttpClient) {

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
      this.next = `${apiUrl}?${params}`;
    } else {
      this.next = url;
    }

    return this.http.get(this.next).map((res: Response) => res.json());
  }


}

export var eventsServiceInjectables: Array<any> = [
  provide(EventsService, { useClass: EventsService })
];
