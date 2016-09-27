import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { HttpClient } from '../core/http-client';

@Injectable()
export class LikesService {
  static API_URL: string = '/api/v1/likes/';
  static MUTUAL_LIKES_API_URL: string = '/api/v1/mutual_likes/';
  static OTHER_LIKES_API_URL: string = '/api/v1/other_likes/';
  next: string = '';

  constructor(private http: HttpClient) {

  }

  public get(url: string, limit: number, user: any): Observable<any> {

    if (url === '') {
      let params: string = [
        `format=json`,
        `limit=${limit}`,
        `user_id=${user}`,
        `offset=0`,
      ].join('&');

      this.next = `${LikesService.API_URL}?${params}`;
    } else {
      this.next = url;
    }

    return this.http.get(this.next).map((res: Response) => res.json());
  }

  public my(url: string, limit: number): Observable<any> {

    if (url === '') {
      let params: string = [
        `format=json`,
        `limit=${limit}`,
        `offset=0`,
      ].join('&');

      this.next = `${LikesService.API_URL}?${params}`;
    } else {
      this.next = url;
    }

    return this.http.get(this.next).map((res: Response) => res.json());
  }
}

