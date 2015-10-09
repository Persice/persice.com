/// <reference path="../../typings/_custom.d.ts" />

import {bind, Inject, Injectable} from 'angular2/angular2';
import {Http, Headers, Response, HTTP_BINDINGS} from 'angular2/http';
import * as Rx from 'rx';

import {SearchResultUserModel} from '../models/searchresults.model';
import {SearchResultEventModel} from '../models/searchresults.model';

let API_URL_USER: string = '/api/v1/auth/user/search/';
let API_URL_EVENT: string = '/api/v1/event/search/';


@Injectable()
export class SearchService {

  constructor(public http: Http,
    @Inject(API_URL_USER) private apiUrlUser: string,
    @Inject(API_URL_EVENT) private apiUrlEvent: string) {

  }

  public searchUsers(query: string): Rx.Observable<SearchResultUserModel[]> {
    let params: string = [
      `format=json`,
      `q=${query}`,
      `page=1`,
    ].join('&');
    let queryUrl: string = `${this.apiUrlUser}?${params}`;
    return this.http.get(queryUrl)
      .map((response: Response) => {
      return (<any>response.json()).objects.map(item => {
        return new SearchResultUserModel(item);
      });
    });

  }

  public searchEvents(query: string): Rx.Observable<SearchResultEventModel[]> {
    let params: string = [
      `format=json`,
      `q=${query}`,
      `page=1`,
    ].join('&');
    let queryUrl: string = `${this.apiUrlEvent}?${params}`;
    return this.http.get(queryUrl)
      .map((response: Response) => {
      return (<any>response.json()).objects.map(item => {
        return new SearchResultEventModel(item);
      });
    });

  }


}

export var searchServiceInjectables: Array<any> = [
  bind(SearchService).toClass(SearchService),
  bind( API_URL_USER).toValue(API_URL_USER),
  bind( API_URL_EVENT).toValue(API_URL_EVENT)
];
