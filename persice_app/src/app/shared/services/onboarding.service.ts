import { provide, Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operator/map';
import { mergeMap } from 'rxjs/operator/mergeMap';

import {HttpClient} from '../core';
import {OPTS_REQ_JSON_CSRF} from '../core';
import {CookieUtil} from '../core';


@Injectable()
export class OnboardingService {
  static API_URL: string = '/api/v1/onboardingflow/';
  constructor(private http: HttpClient) {

  }

  public complete(): Observable<any> {
    let userId = CookieUtil.getValue('userid');
    let body = {
      user: '/api/v1/auth/user/' + userId + '/',
      is_complete: true
    };

    return this.http.post(
      `${OnboardingService.API_URL}?format=json`,
      JSON.stringify(body),
      OPTS_REQ_JSON_CSRF)
      .map((res: Response) => res.json());
  }

}

export var onboardingServiceInjectables: Array<any> = [
  provide(OnboardingService, { useClass: OnboardingService })
];

