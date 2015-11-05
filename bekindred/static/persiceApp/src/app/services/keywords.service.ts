/// <reference path="../../typings/_custom.d.ts" />

import {provide, Inject, Injectable} from 'angular2/angular2';
import {Http, Headers, Response, HTTP_BINDINGS} from 'angular2/http';

let API_URL: string = '/api/v1/interest_subject/';

@Injectable()
export class KeywordsService {
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

  public find(query, limit) {

    let params: string = [
      `format=json`,
      `description__icontains=${query}`,
      `limit=${limit}`
    ].join('&');

    let url = `${this.apiUrl}?${params}`;

    return this.http.get(url)
      .map(res => {
        let data = res.json();
        return data;
      });
  }

}

export var keywordsServiceInjectables: Array<any> = [
  provide(KeywordsService, { useClass: KeywordsService }),
  provide(API_URL, { useValue: API_URL })
];

