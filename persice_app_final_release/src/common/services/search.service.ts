import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '../core/http-client';

@Injectable()
export class SearchService {
  static API_URL_USER: string = SERVER_URI + '/api/v1/auth/user/search/';
  static API_URL_EVENT: string = SERVER_URI + '/api/v1/event/search/';

  constructor(private http: HttpClient) {

  }

  public search(query, type): Observable<any> {
    let params: string = [
      `format=json`,
      `q=${query}`,
      `page=1`,
    ].join('&');
    let apiUrl = '';
    switch (type) {
      case 'user':
        apiUrl = SearchService.API_URL_USER;
        break;
      case 'event':
        apiUrl = SearchService.API_URL_EVENT;
        break;

      default:

        break;
    }

    let queryUrl: string = `${apiUrl}?${params}`;
    return this.http.get(queryUrl).map((res: Response) => res.json());
  }

}

