import { provide, Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operator/map';
import { mergeMap } from 'rxjs/operator/mergeMap';

import {HttpClient} from '../core/http_client';

@Injectable()
export class KeywordsService {
  static API_URL: string = '/api/v1/interest_subject/';
  next: string = '';

  constructor(private http: HttpClient) {
  }

  public get(url: string, limit: number, query: string): Observable<any> {

    if (url === '') {
      let params: string = [
        `format=json`,
        `description__icontains=${query}`,
        `limit=${limit}`,
        `offset=0`,
      ].join('&');

      this.next = `${KeywordsService.API_URL}?${params}`;
    }
    else {
      this.next = url;
    }

    return this.http.get(this.next).map((res: Response) => res.json());
  }

  public find(query, limit): Observable<any> {

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

