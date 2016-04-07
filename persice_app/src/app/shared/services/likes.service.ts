import {provide, Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Observable} from 'rxjs';

import {HttpClient} from '../core';

@Injectable()
export class LikesService {
  static API_URL: string = '/api/v1/likes/';
  next: string = '';

  constructor(private http: HttpClient) {

  }

  public get(url: string, limit: number, user: any): Observable<any> {

    if (url === '') {
      let params: string = [
        `format=json`,
        `limit=${limit}`,
        `user_id=${user}`,
        `offset=0`,
      ].join('&');

      this.next = `${LikesService.API_URL}?${params}`;
    } else {
      this.next = url;
    }

    return this.http.get(this.next).map((res: Response) => res.json());
  }

  public my(url: string, limit: number): Observable<any> {

    if (url === '') {
      let params: string = [
        `format=json`,
        `limit=${limit}`,
        `offset=0`,
      ].join('&');

      this.next = `${LikesService.API_URL}?${params}`;
    } else {
      this.next = url;
    }

    return this.http.get(this.next).map((res: Response) => res.json());
  }


}

export var likesServiceInjectables: Array<any> = [
  provide(LikesService, { useClass: LikesService })
];
