import { provide, Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operator/map';
import { mergeMap } from 'rxjs/operator/mergeMap';

import {HttpClient} from '../core';
import {OPTS_REQ_JSON_CSRF} from '../core';
import {CookieUtil} from '../core';

@Injectable()
export class UserAuthService {
  static API_URL: string = '/api/v1/auth/user/';
  connectStatus = {
    twitter: {
      connected: false,
      username: 'Your twitter account',
      url: ''
    },
    linkedin: {
      connected: false,
      username: 'Your linkedin account',
      url: ''
    }
  };

  stats = {
    goals: 0,
    offers: 0,
    interests: 0
  };

  constructor(private http: HttpClient) {

  }

  public get(): Observable<any> {

    let params = [
      `format=json`
    ].join('&');

    let url = `${UserAuthService.API_URL}?${params}`;

    return this.http.get(url)
      .map((res: Response) => {
        return res.json();
      });
  }

  public findOneByUri(resourceUri: string): Observable<any> {
    let uri = '';
    if (resourceUri === 'me') {
      let userId = CookieUtil.getValue('userid');
      uri = '/api/v1/auth/user/' + userId + '/';
    } else {
      uri = resourceUri;
    }

    return this.http.get(`${uri}?format=json`)
      .map((res: Response) => {
        let data = res.json();
        if (resourceUri === 'me') {
          this.assignConnectStatus(data);
          this.assignStats(data);
        }
        return data;
      });
  }

  public findByUri(resourceUri: string): Observable<any> {
    return this.http.get(`${resourceUri}?format=json`)
      .map((res: Response) => {
        let data = res.json();
        return data;
      });
  }

  public updateOne(resourceUri: string, data: any): Observable<any> {
    const body = JSON.stringify(data);
    let uri = '';
    if (resourceUri === 'me') {
      let userId = CookieUtil.getValue('userid');
      uri = '/api/v1/auth/user/' + userId + '/';
    } else {
      uri = resourceUri;
    }

    return this.http.patch(
      `${uri}?format=json`,
      body,
      OPTS_REQ_JSON_CSRF)
      .map((res: Response) => res.json());
  }

  public getConnectStatus() {
    return this.connectStatus;
  }

  public getStats() {
    return this.stats;
  }

  public itHasInterests(n: number): boolean {
    return this.stats.interests < n ? true : false;
  }

  public updateMe(data): Observable<any> {
    let userId = CookieUtil.getValue('userid');
    let url = `${UserAuthService.API_URL}${userId}/?format=json`;
    let body = JSON.stringify(data);
    return this.http.patch(url, body, OPTS_REQ_JSON_CSRF)
      .map((res: Response) => res.json());
  }

  private assignConnectStatus(data) {
    this.connectStatus.twitter.connected = data.twitter_provider !== null ? true : false;
    this.connectStatus.twitter.username = data.twitter_username ? '@' + data.twitter_username : 'Your twitter account';
    this.connectStatus.twitter.url = data.twitter_username ? 'https://twitter.com/' + data.twitter_username : 'Your twitter account';
    this.connectStatus.linkedin.connected = data.linkedin_provider !== null ? true : false;
    this.connectStatus.linkedin.username = data.linkedin_first_name ? data.linkedin_first_name : 'Your linkedin account';
    this.connectStatus.linkedin.url = data.linkedin_provider ? data.linkedin_provider : 'Your linkedin account';
  }

  private assignStats(data) {
    this.stats.goals = data.goals ? data.goals.length : 0;
    this.stats.offers = data.offers ? data.offers.length : 0;
    this.stats.interests = data.interests ? data.interests.length : 0;
  }

}

export var userAuthServiceInjectables: Array<any> = [
  provide(UserAuthService, { useClass: UserAuthService })
];
