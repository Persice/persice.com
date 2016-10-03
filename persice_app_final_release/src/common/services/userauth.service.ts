import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '../core/http-client';
import { TokenUtil } from '../core/util';

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
    },
    facebook: {
      connected: true,
      username: '',
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
      let userId = TokenUtil.getValue('user_id');
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
      let userId = TokenUtil.getValue('user_id');
      uri = '/api/v1/auth/user/' + userId + '/';
    } else {
      uri = resourceUri;
    }

    return this.http.patch(`${uri}?format=json`, body)
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
    let userId = TokenUtil.getValue('user_id');
    let url = `${UserAuthService.API_URL}${userId}/?format=json`;
    let body = JSON.stringify(data);
    return this.http.patch(url, body)
      .map((res: Response) => res.json());
  }

  private assignConnectStatus(data: any) {
    this.connectStatus.twitter.connected = data.twitter_provider !== null ? true : false;
    this.connectStatus.twitter.username = data.twitter_username ? '@' + data.twitter_username : 'Your twitter account';
    this.connectStatus.twitter.url = data.twitter_username ? 'https://twitter.com/' + data.twitter_username : 'Your twitter account';
    this.connectStatus.linkedin.connected = data.linkedin_provider !== null ? true : false;
    this.connectStatus.linkedin.username = data.linkedin_first_name ? data.linkedin_first_name : 'Your linkedin account';
    this.connectStatus.linkedin.url = data.linkedin_provider ? data.linkedin_provider : 'Your linkedin account';
    this.connectStatus.facebook.url = data.facebook_id ? `https://www.facebook.com/app_scoped_user_id/${data.facebook_id}` : '';
    this.connectStatus.facebook.username = data.username;
  }

  private assignStats(data) {
    this.stats.goals = data.goals ? data.goals.length : 0;
    this.stats.offers = data.offers ? data.offers.length : 0;
    this.stats.interests = data.interests ? data.interests.length : 0;
  }

}

