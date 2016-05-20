import {provide, Injectable, EventEmitter} from '@angular/core';
import {Response} from '@angular/http';
import {Observable} from 'rxjs';

import {HttpClient} from '../core';
import {OPTS_REQ_JSON_CSRF} from '../core';
import {CookieUtil} from '../core';

@Injectable()
export class PoliticalViewsService {
  static API_URL: string = '/api/v1/political_view/';
  static API_URL_INDEX: string = '/api/v1/political_index/';
  next: string = '';
  public emitter: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient) {

  }

  public my(url: string, limit: number): Observable<any> {

    if (url === '') {
      let params: string = [
        `format=json`,
        `limit=${limit}`,
        `offset=0`,
      ].join('&');

      this.next = `${PoliticalViewsService.API_URL}?${params}`;
    } else {
      this.next = url;
    }

    return this.http.get(this.next).map((res: Response) => res.json());
  }

  public getAllPoliticalViewsWithStatus(): void {
    let params: string = [
      `format=json`,
      `limit=100`,
      `offset=0`,
    ].join('&');

    let url = `${PoliticalViewsService.API_URL_INDEX}?${params}`;

    let result: any[] = [];
    this.http.get(url).map((res: Response) => res.json().objects).mergeMap((views: any[]) => {
      for (let view of views) {
        result.push({
          name: view.name,
          url: view.resource_uri,
          selected: false
        });
      }
      return this.my('', 100);
    }).subscribe((resp) => {
      let items = resp.objects;

      for (let i = 0; i < items.length; i++) {
        for (let j = 0; j < result.length; j++) {
          if (result[j].url ===  items[i].political_index) {
            result[j].selected = true;
          }
        }
      }

      this.emitter.emit(result);
    });
  }

  public getIndex(url: string, limit: number): Observable<any> {

    if (url === '') {
      let params: string = [
        `format=json`,
        `limit=${limit}`,
        `offset=0`,
      ].join('&');

      this.next = `${PoliticalViewsService.API_URL_INDEX}?${params}`;
    } else {
      this.next = url;
    }

    return this.http.get(this.next).map((res: Response) => res.json());
  }

  public getByUser(url: string, limit: number, user: any): Observable<any> {

    if (url === '') {
      let params: string = [
        `format=json`,
        `limit=${limit}`,
        `user_id=${user}`,
        `offset=0`,
      ].join('&');

      this.next = `${PoliticalViewsService.API_URL}?${params}`;
    } else {
      this.next = url;
    }

    return this.http.get(this.next).map((res: Response) => res.json());
  }

  public create(data: any): Observable<any> {
    let userId = CookieUtil.getValue('userid');
    let it = {
      political_index: data,
      user: `/api/v1/auth/user/${userId}/`
    };

    const body = JSON.stringify(it);
    return this.http.post(
      `${PoliticalViewsService.API_URL}?format=json`,
      body,
      OPTS_REQ_JSON_CSRF)
      .map((res: Response) => res.json());
  }

  public delete(uri): Observable<any> {
    return this.http.delete(
      `${uri}?format=json`,
      OPTS_REQ_JSON_CSRF)
      .map((res: Response) => res.json());
  }


}

export var politicalViewsServiceInjectables: Array<any> = [
  provide(PoliticalViewsService, { useClass: PoliticalViewsService })
];
