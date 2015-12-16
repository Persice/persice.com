import {provide, Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import * as Rx from 'rxjs';
import {Observable} from 'rxjs';

import {HttpClient} from '../core/http_client';

@Injectable()
export class CrowdService {
  static API_URL: string = '/api/v1/matchfeed2/';
  next: string = '';

  constructor(private http: HttpClient) {

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
