import { provide, Injectable } from 'angular2/angular2';
import { Http, Response } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operator/map';
import { mergeMap } from 'rxjs/operator/mergeMap';

import {HttpClient} from '../core/http_client';

@Injectable()
export class KeywordsService {
  static API_URL: string = '/api/v1/interest_subject/';
  constructor(private http: HttpClient) {
  }

  public get(): Observable<any> {

    let params: string = [
      `format=json`
    ].join('&');

    let url = `${KeywordsService.API_URL}?${params}`;

    return this.http.get(url)
      .map((res: Response) => res.json());
  }

  public find(query, limit): Observable<any>  {

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

