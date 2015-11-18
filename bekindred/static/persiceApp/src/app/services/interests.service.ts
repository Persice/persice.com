/// <reference path="../../typings/_custom.d.ts" />

import {provide, Injectable, Observable} from 'angular2/angular2';
import {Http, Response} from 'angular2/http';


@Injectable()
export class InterestsService {
  static API_URL: string = '/api/v1/interest/';
  constructor(private http: Http) {
  }

  public get(): Observable<any> {
    let params: string = [
      `format=json`
    ].join('&');

    let url = `${InterestsService.API_URL}?${params}`;

    return this.http.get(url)
      .map((res: Response) => res.json());
  }

  public find(query): Observable<any> {

    let params: string = [
      `format=json`,
      `description__icontains=${query}`
    ].join('&');

    let url = `${InterestsService.API_URL}?${params}`;

    return this.http.get(url)
      .map((res: Response) => res.json());
  }

}

export var interestsServiceInjectables: Array<any> = [
  provide(InterestsService, { useClass: InterestsService })
];

