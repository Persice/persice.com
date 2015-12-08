/// <reference path="../../typings/_custom.d.ts" />

import { provide, Injectable } from 'angular2/angular2';
import { Http, Response } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operator/map';
import { mergeMap } from 'rxjs/operator/mergeMap';

Observable.prototype.map = map;
Observable.prototype.flatMap = mergeMap;

@Injectable()
export class SearchService {
  static API_URL_USER: string = '/api/v1/auth/user/search/';
  static API_URL_EVENT: string = '/api/v1/event/search/';

  constructor(private http: Http) {

  }

  public search(query, type): Observable<any> {
    let params: string = [
      `format=json`,
      `q=${query}`,
      `page=1`,
    ].join('&');
    let apiUrl = '';
    switch (type) {
      case 'user':
        apiUrl = SearchService.API_URL_USER;
        break;
      case 'event':
        apiUrl = SearchService.API_URL_EVENT;
        break;

      default:

        break;
    }

    let queryUrl: string = `${apiUrl}?${params}`;
    return this.http.get(queryUrl).map((res: Response) => res.json());
  }

}

export var searchServiceInjectables: Array<any> = [
  provide(SearchService, { useClass: SearchService })
];
