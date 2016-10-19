import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '../core/http-client';

@Injectable()
export class EventAttendeesService {
  static API_URL: string =  SERVER_URI +'/api/v1/attendees/';
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

