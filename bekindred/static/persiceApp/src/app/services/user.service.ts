/// <reference path="../../typings/_custom.d.ts" />

import {provide, Inject, Injectable} from 'angular2/angular2';
import {Http} from 'angular2/http';

import {AuthUserModel} from '../models/user.model';

let API_URL = '/api/v1/me/';

let DEFAULT_IMAGE = '/static/persiceApp/src/public/images/avatar_user_m.jpg';

@Injectable()
export class UserService {
  user: AuthUserModel;
  image: string;
  constructor(
    public http: Http,
    @Inject(API_URL) private apiUrl: string,
    @Inject(DEFAULT_IMAGE) private defaultImage: string
  ) {
    this.image = defaultImage;
  }

  public get() {

    let params = [
      `format=json`
    ].join('&');

    let url = `${this.apiUrl}?${params}`;

    return this.http.get(url)
      .map(res => {
        let data = res.json();
        this.user = new AuthUserModel(data.objects[0]);
        this.image = this.user.info.image;
        return data;
      });
  }

  public getDefaultImage() {
    return this.defaultImage;
  }
}

export var userServiceInjectables: Array<any> = [
  provide(UserService, { useClass: UserService }),
  provide(API_URL, { useValue: API_URL }),
  provide(DEFAULT_IMAGE, { useValue: DEFAULT_IMAGE })
];

