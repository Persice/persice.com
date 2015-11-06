/// <reference path="../../typings/_custom.d.ts" />

import {provide, Inject, Injectable} from 'angular2/angular2';
import {Http, Headers, Response, HTTP_BINDINGS} from 'angular2/http';

let API_URL: string = '/api/v1/interest/';

@Injectable()
export class InterestsService {
  constructor(
    public http: Http,
    @Inject(API_URL) private apiUrl: string
  ) {
  }

  public get() {

    let params: string = [
      `format=json`
    ].join('&');

    let url = `${this.apiUrl}?${params}`;

    return this.http.get(url)
      .map(res => {
        let data = res.json();
        return data;
      });
  }

  public find(query) {

    let params: string = [
      `format=json`,
      `description__icontains=${query}`
    ].join('&');

    let url = `${this.apiUrl}?${params}`;

    return this.http.get(url)
      .map(res => {
        let data = res.json();
        return data;
      });
  }

}

export var interestsServiceInjectables: Array<any> = [
  provide(InterestsService, { useClass: InterestsService }),
  provide(API_URL, { useValue: API_URL })
];

