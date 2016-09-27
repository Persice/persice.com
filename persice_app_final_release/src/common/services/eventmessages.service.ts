import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { HttpClient } from '../core/http-client';

@Injectable()
export class EventMessagesService {
  static API_URL: string = '/api/v1/chat/';
  next: string = '';

  constructor(private http: HttpClient) { }

  public get(url: string, limit: number, event: number): Observable<any> {

    if (url === '') {
      let params: string = [
        `format=json`,
        `limit=${limit}`,
        `event=${event}`,
        `offset=0`,
      ].join('&');

      let apiUrl = `${EventMessagesService.API_URL}`;
      this.next = `${apiUrl}?${params}`;
    } else {
      this.next = url;
    }

    return this.http.get(this.next).map((res: Response) => res.json());
  }

  public findOneByUri(resourceUri: string): Observable<any> {
    return this.http.get(resourceUri).map((res: Response) => res.json());
  }

  public findOneById(id: string): Observable<any> {

    let params: string = [
      `format=json`,
    ].join('&');

    let apiUrl = `${EventMessagesService.API_URL}/${id}/`;
    let url = `${apiUrl}?${params}`;
    return this.http.get(url).map((res: Response) => res.json());
  }

}
