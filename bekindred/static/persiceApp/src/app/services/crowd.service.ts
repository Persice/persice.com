/// <reference path="../../typings/_custom.d.ts" />

import {provide, Inject, Injectable} from 'angular2/angular2';
import {Http, Headers, Response, HTTP_BINDINGS} from 'angular2/http';
import * as Rx from 'rx';

let API_URL_V1: string = '/api/v1/matchfeed/';
let API_URL_V2: string = '/api/v1/matchfeed2/';


@Injectable()
export class CrowdService {
  next: string = '';
  constructor(
    public http: Http,
    @Inject(API_URL_V1) private apiUrlV1: string,
    @Inject(API_URL_V2) private apiUrlV2: string
  ) {

  }

  public get(url: string, limit: number, version: string, filter: boolean) {

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
          apiUrl = `${this.apiUrlV1}?${params}`;
          break;
        case 'v2':
          apiUrl = `${this.apiUrlV2}?${params}`;
          break;
        default:
          apiUrl = `${this.apiUrlV2}?${params}`;
          break;
      }
      this.next = apiUrl;
    }
    else {
      this.next = url;
    }

    return this.http.get(this.next);
  }


}

export var crowdServiceInjectables: Array<any> = [
  provide(CrowdService, { useClass: CrowdService }),
  provide(API_URL_V1, { useValue: API_URL_V1 }),
  provide(API_URL_V2, { useValue: API_URL_V2 })
];
