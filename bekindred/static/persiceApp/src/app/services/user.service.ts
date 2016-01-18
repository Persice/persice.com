import { provide, Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operator/map';
import { mergeMap } from 'rxjs/operator/mergeMap';

import {AuthUserModel} from '../models/user.model';
import {HttpClient} from '../core/http_client';


@Injectable()
export class UserService {
  static API_URL: string = '/api/v1/me/';
  static DEFAULT_IMAGE: string = '/static/persiceApp/src/assets/images/avatar_user_m.jpg';
  user: AuthUserModel;
  image: string = UserService.DEFAULT_IMAGE;
  constructor(private http: HttpClient) {

  }

  public get(): Observable<any> {

    let params = [
      `format=json`
    ].join('&');

    let url = `${UserService.API_URL}?${params}`;

    return this.http.get(url)
      .map((res: Response) => {
        let data = res.json();
        this.user = new AuthUserModel(data['objects'][0]);
        this.image = this.user.info.image;
        return res.json();
      });
  }

  public findOneByUri(resourceUri: string): Observable<any> {
    return this.http.get(resourceUri).map((res: Response) => res.json());
  }

  public getDefaultImage() {
    return UserService.DEFAULT_IMAGE;
  }

}

export var userServiceInjectables: Array<any> = [
  provide(UserService, { useClass: UserService })
];

