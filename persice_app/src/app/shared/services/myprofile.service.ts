import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { HttpClient } from '../../../common/core';
import { TokenUtil } from '../../../common/core/util';

@Injectable()
export class MyProfileService {
  static API_URL: string = '/api/v1/user_profile/';

  constructor(private http: HttpClient) {

  }

  public get(): Observable<any> {
    let userId = TokenUtil.getValue('user_id');
    let url = this.buildUrl(userId);
    return this.http.get(url)
      .map((res: Response) => {
        return res.json();
      });
  }

  public update(data): Observable<any> {
    let userId = TokenUtil.getValue('user_id');
    let url = this.buildUrl(userId);
    let body = JSON.stringify(data);

    return this.http.patch(url, body)
      .map((res: Response) => res.json());
  }

  private buildUrl(userId: string) {
    return `${MyProfileService.API_URL}${userId}/?format=json`;
  }
}

export var myProfileServiceInjectables: Array<any> = [
  {provide: MyProfileService, useClass: MyProfileService}
];
