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


  public delete(url: string, cb: (status: number) => void) {
    let channel = this.http.delete(`${url}?format=json`, OPTS_REQ_JSON_CSRF).map((res: Response) => res.json())
      .subscribe((data) => {
        cb(1);
        channel.unsubscribe();
      }, error => {
        console.log('Could not delete photo.');
        cb(-1);
      });
  }

  public save(image, cb: (status: number) => void) {
    let userId = CookieUtil.getValue('userid');
    let photo = {
      cropped_photo: image.cropped,
      order: image.order,
      photo: image.original,
      user: '/api/v1/auth/user/' + userId + '/'
    };
    let body = JSON.stringify(photo);
    let channel = this.http.post(`${PhotosService.API_URL}?format=json`, body, OPTS_REQ_JSON_CSRF)
      .map((res: Response) => res.json())
      .subscribe((data) => {
        cb(1);
        channel.unsubscribe();
      }, error => {
        console.log('Could not save new photo.');
        cb(-1);
      });
  }

  public update(image, url, cb: (status: number) => void) {
    let userId = CookieUtil.getValue('userid');
    let photo = {
      cropped_photo: image.cropped,
      order: image.order,
      photo: image.original,
      user: '/api/v1/auth/user/' + userId + '/'
    };
    let body = JSON.stringify(photo);
    let channel = this.http.put(`${url}?format=json`, body, OPTS_REQ_JSON_CSRF)
      .map((res: Response) => res.json())
      .subscribe((data) => {
        cb(1);
        channel.unsubscribe();
      }, error => {
        console.log('Could not save new photo.');
        cb(-1);
      });
  }

  public batchUpdate(data): Observable<any> {
    let body = JSON.stringify(data);
    return this.http.patch(`${PhotosService.API_URL}?format=json`, body, OPTS_REQ_JSON_CSRF)
      .map((res: Response) => res.json());

  }


}

export var photosServiceInjectables: Array<any> = [
  provide(PhotosService, { useClass: PhotosService })
];
