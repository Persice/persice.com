import {provide, Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {Observable} from 'rxjs';
import {HttpClient} from '../core';
import {OPTS_REQ_JSON_CSRF} from '../core';
import {CookieUtil} from '../core';

@Injectable()
export class InterestsService {
  static API_URL: string = '/api/v1/interest/';
  next: string = '';

  constructor(private http: HttpClient) {
  }

  public get(url: string, limit: number): Observable<any> {
    let userId = CookieUtil.getValue('userid');
    if (url === '') {
      let params: string = [
        `format=json`,
        `limit=${limit}`,
        `user_id=${userId}`,
        `offset=0`,
      ].join('&');

      this.next = `${InterestsService.API_URL}?${params}`;
    } else {
      this.next = url;
    }

    return this.http.get(this.next).map((res: Response) => res.json());
  }

  public getCount(): Observable<any> {
    let userId = CookieUtil.getValue('userid');

    let params: string = [
      `format=json`,
      `limit=1`,
      `user_id=${userId}`,
      `offset=0`,
    ].join('&');
    let url = `${InterestsService.API_URL}?${params}`;
    return this.http.get(url).map((dto: Response) => dto.json().meta.total_count);
  }

  public find(query): Observable<any> {

    let params: string = [
      `format=json`,
      `description__icontains=${query}`
    ].join('&');

    let url = `${InterestsService.API_URL}?${params}`;

    return this.http.get(url)
      .map((res: Response) => res.json());
  }

  public save(subject: string): Observable<any> {
    let userId = CookieUtil.getValue('userid');
    let interest = {
      interest_subject: subject.trim(),
      user: '/api/v1/auth/user/' + userId + '/'
    };
    let body = JSON.stringify(interest);
    return this.http.post(`${InterestsService.API_URL}?format=json`, body, OPTS_REQ_JSON_CSRF)
      .map((res: Response) => res.json());
  }

  public delete(url: string): Observable<any> {
    return this.http.delete(`${url}?format=json`, OPTS_REQ_JSON_CSRF)
      .map((res: Response) => res.json());
  }

}

export var interestsServiceInjectables: Array<any> = [
  provide(InterestsService, { useClass: InterestsService })
];
