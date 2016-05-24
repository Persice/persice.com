import {provide, Injectable, EventEmitter} from '@angular/core';
import {Response} from '@angular/http';
import {Observable} from 'rxjs';

import {HttpClient} from '../core';
import {OPTS_REQ_JSON_CSRF} from '../core';
import {CookieUtil, ListUtil} from '../core';
import {Photo} from '../../../common/models/photo'

@Injectable()
export class PhotosService {
  static API_URL: string = '/api/v1/photo/';
  next: string = '';
  public photosCounterEmitter: EventEmitter<any> = new EventEmitter();

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

  public getCount(): Observable<any> {
    let userId = CookieUtil.getValue('userid');
    let params: string = [
      `format=json`,
      `limit=1`,
      `user_id=${userId}`,
      `offset=0`,
    ].join('&');
    let url = `${PhotosService.API_URL}?${params}`;
    return this.http.get(url).map((dto: Response) => dto.json().meta.total_count);
  }

  public getMyPhotosForEditing(): Observable<Photo[]> {
    let userId = CookieUtil.getValue('userid');
    let params: string = [
      `format=json`,
      `limit=5`,
      `user_id=${userId}`,
      `offset=0`,
    ].join('&');
    let url = `${PhotosService.API_URL}?${params}`;

    return this.http.get(url).map((dto: Response) => {
      let dtoJson = dto.json();

      // Emit counter of photos
      this.photosCounterEmitter.emit(dtoJson.meta.total_count);

      // Sort photos by order and create a temporary list of 5 photos used for editing purposes.
      // If photo does not exist, put empty Photo in temporary list.
      // Main profile photo has order 0.
      // Other photos with order > 0 are thumbs.
      let sortedPhotos = ListUtil.orderBy(dtoJson.objects, ['order'], ['asc']);
      let photosTemp: Photo[] = [];
      for (let i = 0; i <= 4; i++) {
        if (sortedPhotos[i] && sortedPhotos[i].order === i) {
          photosTemp = [...photosTemp, new Photo(sortedPhotos[i])];
        } else {
          let emptyPhoto = new Photo({order: i});
          photosTemp = [...photosTemp, emptyPhoto];
        }
      }
      return photosTemp;
    });
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
      bounds: image.cropped,
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

  public updateOrder(image, url, cb: (status: number) => void) {
    let photo = {
      order: image.order,
      resource_uri: image.resource_uri
    };

    let body = JSON.stringify(photo);
    let channel = this.http.patch(`${url}?format=json`, body, OPTS_REQ_JSON_CSRF)
      .map((res: Response) => res.json())
      .subscribe((data) => {
        cb(1);
        channel.unsubscribe();
      }, error => {
        console.log('Could not save new photo.');
        cb(-1);
      });
  }

  public batchUpdateOrder(data): Observable<any> {
    let photos = [];
    for (var i = data.length - 1; i >= 0; i--) {
      photos = [...photos, {
        order: data[i].order,
        resource_uri: data[i].resource_uri
      }];
    }

    let body = JSON.stringify({ objects: photos });

    return this.http.patch(`${PhotosService.API_URL}?format=json`, body, OPTS_REQ_JSON_CSRF)
      .map((res: Response) => res.json());

  }


}

export var photosServiceInjectables: Array<any> = [
  provide(PhotosService, { useClass: PhotosService })
];
