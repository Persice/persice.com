import {provide, Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Observable} from 'rxjs';

import {HttpClient} from '../core/http_client';
import {OPTS_REQ_JSON_CSRF} from '../core/http_constants';
import {CookieUtil} from '../core/util';

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


  public delete(url: string, cb:(status:number)=>void) {
    let channel = this.http.delete(`${url}?format=json`, OPTS_REQ_JSON_CSRF).map((res: Response) => res.json())
      .subscribe((data) => {
        cb(1);
        channel.unsubscribe();
      }, error => {
        console.log('Could not delete photo.');
        cb(-1);
      })
  }


}

export var photosServiceInjectables: Array<any> = [
  provide(PhotosService, { useClass: PhotosService })
];
