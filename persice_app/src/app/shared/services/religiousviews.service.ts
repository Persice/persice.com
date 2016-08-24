import { Injectable, EventEmitter } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { HttpClient } from '../../../common/core';
import { TokenUtil } from '../../../common/core/util';

@Injectable()
export class ReligiousViewsService {
  static API_URL: string = '/api/v1/religious_view/';
  static API_URL_INDEX: string = '/api/v1/religious_index/';
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

      this.next = `${ReligiousViewsService.API_URL}?${params}`;
    } else {
      this.next = url;
    }

    return this.http.get(this.next).map((res: Response) => res.json());
  }

  public getAllReligiousViewsWithStatus(): void {
    let params: string = [
      `format=json`,
      `limit=100`,
      `offset=0`,
    ].join('&');

    let url = `${ReligiousViewsService.API_URL_INDEX}?${params}`;

    let result: any[] = [];
    this.http.get(url).map((res: Response) => res.json().objects).mergeMap((views: any[]) => {
      for (let view of views) {
        result.push({
          name: view.name,
          index_url: view.resource_uri,
          selected: false
        });
      }
      return this.my('', 100);
    }).subscribe((resp) => {
      let items = resp.objects;

      for (let i = 0; i < items.length; i++) {
        for (let j = 0; j < result.length; j++) {
          if (result[j].index_url === items[i].religious_index) {
            result[j].selected = true;
            result[j].view_url = items[i].resource_uri;
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

      this.next = `${ReligiousViewsService.API_URL_INDEX}?${params}`;
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

      this.next = `${ReligiousViewsService.API_URL}?${params}`;
    } else {
      this.next = url;
    }

    return this.http.get(this.next).map((res: Response) => res.json());
  }

  public create(data: any): Observable<any> {
    let userId = TokenUtil.getValue('user_id');
    let it = {
      religious_index: data,
      user: `/api/v1/auth/user/${userId}/`
    };

    const body = JSON.stringify(it);
    return this.http.post(`${ReligiousViewsService.API_URL}?format=json`, body)
      .map((res: Response) => res.json());
  }

  public delete(uri): Observable<any> {
    return this.http.delete(`${uri}?format=json`)
      .map((res: Response) => res.json());
  }

}

export var religiousViewsServiceInjectables: Array<any> = [
  {provide: ReligiousViewsService, useClass: ReligiousViewsService}
];
