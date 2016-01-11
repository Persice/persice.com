import {provide, Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import * as Rx from 'rxjs';
import {Observable} from 'rxjs';

import {HttpClient} from '../core/http_client';

@Injectable()
export class PhotosService {
  static API_URL: string = '/api/v1/photo/';
  next: string = '';

  constructor(private http: HttpClient) {

  }

  public get(url: string, limit: number, user: number): Observable<any> {

    if (url === '') {
      let params: string = [
        `format=json`,
        `limit=${limit}`,
        `user_id=${user}`,
        `offset=0`,
      ].join('&');

      this.next = `${PhotosService.API_URL}?${params}`;
    } else {
      this.next = url;
    }

    return this.http.get(this.next).map((res: Response) => res.json());
  }


}

export var photosServiceInjectables: Array<any> = [
  provide(PhotosService, { useClass: PhotosService })
];
