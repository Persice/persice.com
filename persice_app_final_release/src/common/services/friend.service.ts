import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '../core/http-client';

@Injectable()
export class FriendService {
  static API_URL: string = SERVER_URI + '/api/v1/friends/';
  static API_URLv2: string = SERVER_URI + '/api/v2/friends/';
  next: string = '';

  constructor(private http: HttpClient) { }

  public get(url: string, limit: number): Observable<any> {

    if (url === '') {
      let params: string = [
        `format=json`,
        `limit=${limit}`,
        `offset=0`,
      ].join('&');

      this.next = `${FriendService.API_URL}?${params}`;
    } else {
      this.next = url;
    }

    return this.http.get(this.next).map((res: Response) => res.json());
  }

  public saveFriendship(status: number, friendId: string): Observable<any> {
    let friendshipState = {};

    if (status === 0) {
      friendshipState = {
        user_id: friendId
      };
    } else {
      friendshipState = {
        user_id: friendId,
        action: 'pass'
      };
    }

    let body = JSON.stringify(friendshipState);

    return this.http.post(`${FriendService.API_URLv2}?format=json`, body)
      .map((res: Response) => res.json());
  }

  public disconnect(friendId: string): Observable<any> {

    let friendshipState = {
      user_id: friendId,
      action: 'disconnect'
    };

    let body = JSON.stringify(friendshipState);
    return this.http.post(`${FriendService.API_URLv2}?format=json`, body)
      .map((res: Response) => res.json());
  }
}
