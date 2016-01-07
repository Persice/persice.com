import { provide, Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operator/map';
import { mergeMap } from 'rxjs/operator/mergeMap';
import {HttpClient} from '../core/http_client';

Observable.prototype.map = map;
Observable.prototype.flatMap = mergeMap;

@Injectable()
export class MutualFriendsService {
  static API_URL_V1: string = '/api/v1/mutual/friends/';
  next: string = '';
  constructor(private http: HttpClient) {

  }

  public get(url: string, limit: number, id: number): Observable<any> {

    if (url === '') {
      let params: string = [
        `format=json`,
        `limit=${limit}`,
        `user_id=${id}`,
        `offset=0`,
      ].join('&');

      this.next = `${MutualFriendsService.API_URL_V1}?${params}`;
    } else {
      this.next = url;
    }

    return this.http.get(this.next).map((res: Response) => res.json());
  }


}

export var mutualfriendsServiceInjectables: Array<any> = [
  provide(MutualFriendsService, { useClass: MutualFriendsService })
];
