import {provide, Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {Observable} from 'rxjs';

import {HttpClient} from '../core';
import {OPTS_REQ_JSON_CSRF} from '../core';
import {CookieUtil} from '../core';
import {Person} from "../../../app-mobile/shared/model/person";

@Injectable()
export class MyProfileService {
  static API_URL: string = '/api/v1/user_profile/';
  constructor(private http: HttpClient) {

  }

  public get(): Observable<any> {
    let userId = CookieUtil.getValue('userid');
    let url = this.buildUrl(userId);
    return this.http.get(url)
    .map((res: Response) => {
      return res.json();
    });
  }

  public update(data): Observable<any> {
    let userId = CookieUtil.getValue('userid');
    let url = this.buildUrl(userId);
    let body = JSON.stringify(data);

    return this.http.patch(url, body, OPTS_REQ_JSON_CSRF)
    .map((res: Response) => res.json());
  }

  private buildUrl(userId:string) {
    return `${MyProfileService.API_URL}${userId}/?format=json`;
  }
}

export var myProfileServiceInjectables: Array<any> = [
provide(MyProfileService, { useClass: MyProfileService })
];
