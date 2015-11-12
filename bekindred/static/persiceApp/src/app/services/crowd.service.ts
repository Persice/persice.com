/// <reference path="../../typings/_custom.d.ts" />

import {provide, Injectable} from 'angular2/angular2';
import {Http, Response} from 'angular2/http';
import * as Rx from '@reactivex/rxjs';

@Injectable()
export class CrowdService {
  static API_URL_V1: string = '/api/v1/matchfeed/';
  static API_URL_V2: string = '/api/v1/matchfeed2/';
  next: string = '';

  constructor(private http: Http) {

  }

  public get(url: string, limit: number, version: string, filter: boolean): Rx.Observable<any> {

    if (url === '') {
      let params: string = [
        `format=json`,
        `limit=${limit}`,
        `filter=${filter}`,
        `offset=0`,
      ].join('&');
      let apiUrl = '';

      switch (version) {
        case 'v1':
          apiUrl = `${CrowdService.API_URL_V1}?${params}`;
          break;
        case 'v2':
          apiUrl = `${CrowdService.API_URL_V2}?${params}`;
          break;
        default:
          apiUrl = `${CrowdService.API_URL_V2}?${params}`;
          break;
      }
      this.next = apiUrl;
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
