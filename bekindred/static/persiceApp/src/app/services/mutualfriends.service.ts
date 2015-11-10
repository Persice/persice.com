/// <reference path="../../typings/_custom.d.ts" />

import {provide, Inject, Injectable} from 'angular2/angular2';
import {Http} from 'angular2/http';

let API_URL_V1 = '/api/v1/mutual/friends/';


@Injectable()
export class MutualFriendsService {
  next: string = '';
  constructor(
    public http: Http,
    @Inject(API_URL_V1) private apiUrlV1: string
  ) {

  }

  public get(url: string, limit: number, version: string, id: number) {

    if (url === '') {
      let params: string = [
        `format=json`,
        `limit=${limit}`,
        `user_id=${id}`,
        `offset=0`,
      ].join('&');
      let apiUrl = '';

      switch (version) {
        default:
          apiUrl = `${this.apiUrlV1}?${params}`;
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

export var mutualfriendsServiceInjectables: Array<any> = [
  provide(MutualFriendsService, { useClass: MutualFriendsService }),
  provide(API_URL_V1, { useValue: API_URL_V1 }),
];
