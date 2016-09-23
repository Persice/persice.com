import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { HttpClient, ListUtil } from '../../../common/core';
import { Photo } from '../../../common/models/photo';
import { TokenUtil } from '../../../common/core/util';

@Injectable()
export class PhotosService {
  static API_URL: string = '/api/v1/photo/';
  next: string = '';

  /**
   * Sort photos by order and create an array of (limit) photos used for editing purposes.
   * @param {any} dtoJson [description]
   */
  public static getEditPhotos(dtoJson: any, limit: number): Photo[] {

    let photosTemp: Photo[] = [];

    for (let i = 0; i <= limit - 1; i++) {
      let emptyPhoto = new Photo({order: i});
      photosTemp = [...photosTemp, emptyPhoto];
    }

    if (!!dtoJson) {
      let sortedPhotos = ListUtil.orderBy(dtoJson.objects, ['order'], ['asc']);
      for (var i = 0; i < sortedPhotos.length; ++i) {
        for (var j = 0; j < photosTemp.length; ++j) {
          if (sortedPhotos[i].order === photosTemp[j].order) {
            photosTemp[j] = new Photo(sortedPhotos[i]);
          }
        }
      }
    }

    return photosTemp;
  }

  /**
   * Get photos count
   * @param {any} dtoJson [description]
   */
  public static getEditPhotosCount(dtoJson: any): number {
    let count: number = 0;
    if (!!dtoJson && !!dtoJson.meta) {
      count = dtoJson.meta.total_count;
    }
    return count;
  }

  constructor(private http: HttpClient) { }

  public get(url: string, limit: number, user: number): Observable<any> {

    if (url === '') {
      let params: string = [
        `format=json`,
        `order_by=order`,
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
    let userId = TokenUtil.getValue('user_id');
    let params: string = [
      `format=json`,
      `limit=1`,
      `user_id=${userId}`,
      `offset=0`,
    ].join('&');
    let url = `${PhotosService.API_URL}?${params}`;
    return this.http.get(url).map((dto: Response) => dto.json().meta.total_count);
  }

  public getMyPhotos(limit: number): Observable<any> {
    let userId = TokenUtil.getValue('user_id');
    let params: string = [
      `format=json`,
      `limit=${limit}`,
      `user_id=${userId}`,
      `offset=0`,
    ].join('&');
    let url = `${PhotosService.API_URL}?${params}`;

    return this.http.get(url).map((dto: Response) => dto.json());
  }

  public delete(url: string, cb: (status: number) => void) {
    let channel = this.http.delete(`${url}?format=json`)
      .subscribe((data) => {
        cb(1);
        channel.unsubscribe();
      }, error => {
        console.log('Could not delete photo.');
        cb(-1);
      });
  }

  public save(image, cb: (status: number) => void) {
    let userId = TokenUtil.getValue('user_id');
    let photo = {
      bounds: image.cropped,
      order: image.order,
      photo: image.original,
      user: '/api/v1/auth/user/' + userId + '/'
    };
    let body = JSON.stringify(photo);
    let channel = this.http.post(`${PhotosService.API_URL}?format=json`, body)
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
    let channel = this.http.patch(`${url}?format=json`, body)
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

    let body = JSON.stringify({objects: photos});

    return this.http.patch(`${PhotosService.API_URL}?format=json`, body)
      .map((res: Response) => res.json());

  }

}

export var photosServiceInjectables: Array<any> = [
  {provide: PhotosService, useClass: PhotosService}
];
