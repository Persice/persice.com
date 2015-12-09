import { provide, Injectable } from 'angular2/angular2';
import { Http, Response } from 'angular2/http';
import * as Rx from 'rxjs';
import {Observable} from 'rxjs';

@Injectable()
export class EventAttendeesService {
  static API_URL: string = '/api/v1/attendees/';
  next: string = '';

  constructor(private http: Http) {

  }

  public get(url: string, limit: number, event: number, rsvp: string, firstName: string): Observable<any> {

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
    }
    else {
      this.next = url;
    }

    return this.http.get(this.next).map((res: Response) => res.json());
  }


}

export var eventAttendeesServiceInjectables: Array<any> = [
  provide(EventAttendeesService, { useClass: EventAttendeesService })
];
