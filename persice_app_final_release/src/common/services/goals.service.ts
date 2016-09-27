import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { HttpClient } from '../core/http-client';
import { TokenUtil } from '../core/util';

@Injectable()
export class GoalsService {
  static API_URL: string = '/api/v1/goal/';
  next: string = '';

  constructor(private http: HttpClient) {
  }

  public get(url: string, limit: number): Observable<any> {
    let userId = TokenUtil.getValue('user_id');
    if (url === '') {
      let params: string = [
        `format=json`,
        `limit=${limit}`,
        `user_id=${userId}`,
        `offset=0`,
      ].join('&');

      this.next = `${GoalsService.API_URL}?${params}`;
    } else {
      this.next = url;
    }

    return this.http.get(this.next).map((res: Response) => res.json());
  }

  public getCount(): Observable<any> {
    let userId = TokenUtil.getValue('user_id');

    let params: string = [
      `format=json`,
      `limit=1`,
      `user_id=${userId}`,
      `offset=0`,
    ].join('&');
    let url = `${GoalsService.API_URL}?${params}`;
    return this.http.get(url).map((dto: Response) => dto.json().meta.total_count);
  }

  public save(subject: string): Observable<any> {
    let userId = TokenUtil.getValue('user_id');
    let interest = {
      goal_subject: subject.trim(),
      user: '/api/v1/auth/user/' + userId + '/'
    };
    let body = JSON.stringify(interest);
    return this.http.post(`${GoalsService.API_URL}?format=json`, body)
      .map((res: Response) => res.json());
  }

  public delete(url: string): Observable<any> {
    return this.http.delete(`${url}?format=json`);
  }

}
