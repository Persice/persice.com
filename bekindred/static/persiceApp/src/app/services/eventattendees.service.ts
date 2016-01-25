import { provide, Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import {Observable} from 'rxjs';

import {HttpClient} from '../core/http_client';

@Injectable()
export class EventAttendeesService {
  static API_URL: string = '/api/v1/attendees/';
  next: string = '';

  constructor(private http: HttpClient) {

  }

  public get(
    url: string,
    limit: number,
    event: number,
    rsvp: string,
    firstName: string
  ): Observable<any> {

    if (url === '') {
      let params: string = [
        `format=json`,
        `limit=${limit}`,
        `event=${event}`,
        `rsvp=${rsvp}`,
        `offset=0`,
        `user__first_name__icontains=${firstName}`
      ].join('&');

      let apiUrl = `${EventAttendeesService.API_URL}`;
      this.next = `${apiUrl}?${params}`;
    } else {
      this.next = url;
    }

    return this.http.get(this.next).map((res: Response) => res.json());
  }


}

export var eventAttendeesServiceInjectables: Array<any> = [
  provide(EventAttendeesService, { useClass: EventAttendeesService })
];
