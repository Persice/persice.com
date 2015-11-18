/// <reference path="../../typings/_custom.d.ts" />

import {provide, Injectable, Observable} from 'angular2/angular2';
import {Http, Response} from 'angular2/http';


import {AuthUserModel} from '../models/user.model';



@Injectable()
export class UserService {
  static API_URL: string = '/api/v1/me/';
  static DEFAULT_IMAGE: string = '/static/persiceApp/src/public/images/avatar_user_m.jpg';
  user: AuthUserModel;
  image: string = UserService.DEFAULT_IMAGE;
  constructor(private http: Http) {

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

  public getDefaultImage() {
    return UserService.DEFAULT_IMAGE;
  }
}

export var userServiceInjectables: Array<any> = [
  provide(UserService, { useClass: UserService })
];

