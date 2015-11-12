/// <reference path="../../typings/_custom.d.ts" />

import {provide, Injectable} from 'angular2/angular2';
import {Http, Response} from 'angular2/http';
import * as Rx from '@reactivex/rxjs';

@Injectable()
export class KeywordsService {
  static API_URL: string = '/api/v1/interest_subject/';
  constructor(private http: Http) {
  }

  public get(): Rx.Observable<any> {

    let params: string = [
      `format=json`
    ].join('&');

    let url = `${KeywordsService.API_URL}?${params}`;

    return this.http.get(url)
      .map((res: Response) => res.json());
  }

  public find(query, limit): Rx.Observable<any>  {

    let params: string = [
      `format=json`,
      `description__icontains=${query}`,
      `limit=${limit}`
    ].join('&');

    let url = `${KeywordsService.API_URL}?${params}`;

    return this.http.get(url)
      .map((res: Response) => res.json());
  }

}

export var keywordsServiceInjectables: Array<any> = [
  provide(KeywordsService, { useClass: KeywordsService })
];

