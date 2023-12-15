import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '../core/http-client';

@Injectable()
export class EventConnectionsService {
  static API_URL: string =  SERVER_URI + '/api/v1/events/connections/';
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