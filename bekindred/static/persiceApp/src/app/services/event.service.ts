/// <reference path="../../typings/_custom.d.ts" />

import {provide, Injectable, Observable} from 'angular2/angular2';
import {Http, Response} from 'angular2/http';


@Injectable()
export class EventService {
  static API_URL: string = '/api/v1/event/';
  next: string = '';

  constructor(private http: Http) {

  }

  public get(url: string, limit: number): Observable<any> {

    if (url === '') {
      let params: string = [
        `format=json`,
        `limit=${limit}`,
        `offset=0`,
      ].join('&');

      let apiUrl = `${EventService.API_URL}`;
      this.next = `${apiUrl}?${params}`;
    }
    else {
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

    let apiUrl = `${EventService.API_URL}/${id}/`;
    let url = `${apiUrl}?${params}`;
    return this.http.get(url).map((res: Response) => res.json());
  }


}

export var eventServiceInjectables: Array<any> = [
  provide(EventService, { useClass: EventService })
];
