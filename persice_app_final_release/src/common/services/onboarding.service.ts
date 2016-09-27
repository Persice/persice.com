import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { HttpClient } from '../core/http-client';
import { TokenUtil } from '../core/util';

@Injectable()
export class OnboardingService {
  static API_URL: string = '/api/v1/onboardingflow/';

  constructor(private http: HttpClient) {

  }

  public isOnboardingFinished(): Observable<boolean> {

    return this.http.get(
      `${OnboardingService.API_URL}?format=json`)
      .map((res: Response) => {
        let result = res.json();
        let onboardingFinished: boolean = false;

        try {
          onboardingFinished = result.objects[ 0 ].is_complete;
        }
        catch (err) {

        }

        return onboardingFinished;

      });
  }

  public complete(): Observable<any> {
    let userId = TokenUtil.getValue('user_id');
    let body = {
      user: '/api/v1/auth/user/' + userId + '/',
      is_complete: true
    };

    return this.http.post(
      `${OnboardingService.API_URL}?format=json`, JSON.stringify(body))
      .map((res: Response) => res.json());
  }

}


