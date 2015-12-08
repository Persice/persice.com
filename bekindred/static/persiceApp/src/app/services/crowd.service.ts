/// <reference path="../../typings/_custom.d.ts" />

import { provide, Injectable } from 'angular2/angular2';
import { Http, Response } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operator/map';
import { mergeMap } from 'rxjs/operator/mergeMap';

Observable.prototype.map = map;
Observable.prototype.flatMap = mergeMap;

@Injectable()
export class CrowdService {
  static API_URL: string = '/api/v1/matchfeed2/';
  next: string = '';

  constructor(private http: Http) {

  }

  public get(url: string, limit: number, filter: boolean): Observable<any> {

    if (url === '') {
      let params: string = [
        `format=json`,
        `limit=${limit}`,
        `filter=${filter}`,
        `offset=0`,
      ].join('&');

      this.next = `${CrowdService.API_URL}?${params}`;
    }
    else {
      this.next = url;
    }

    return this.http.get(this.next).map((res: Response) => res.json());
  }


}

export var crowdServiceInjectables: Array<any> = [
  provide(CrowdService, { useClass: CrowdService })
];
