/// <reference path="../../typings/_custom.d.ts" />

import { provide, Injectable } from 'angular2/angular2';
import { Http, Response } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operator/map';
import { mergeMap } from 'rxjs/operator/mergeMap';

Observable.prototype.map = map;
Observable.prototype.flatMap = mergeMap;

import {OPTS_REQ_JSON_CSRF} from '../core/http_constants';

import {remove, find} from 'lodash';

@Injectable()
export class EventMembersService {
  static API_URL: string = '/api/v1/member/';

  constructor(private http: Http) {

  }

  public find(): Observable<any> {

    let params: string = [
      `format=json`
    ].join('&');

    let url = `${EventMembersService.API_URL}?${params}`;

    return this.http.get(url).map((res: Response) => res.json());
  }


  public findOneByUri(resourceUri: string): Observable<any> {
    return this.http.get(resourceUri).map((res: Response) => res.json());
  }

  public updateOneByUri(resourceUri: string, data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.patch(
      resourceUri,
      body,
      OPTS_REQ_JSON_CSRF)
      .map((res: Response) => res.json());
  }

  public createOne(data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post(
      EventMembersService.API_URL,
      body,
      OPTS_REQ_JSON_CSRF)
      .map((res: Response) => res.json());
  }


}
export var eventMembersServiceInjectables: Array<any> = [
  provide(EventMembersService, { useClass: EventMembersService })
];
