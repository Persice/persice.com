import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { HttpClient } from '../core/http-client';

@Injectable()
export class CrowdService {
  static API_URL: string = '/api/v1/matchfeed/';
  next: string = '';

  constructor(protected http: HttpClient) {}

  public get(url: string, limit: number): Observable<any> {

    if (url === '') {
      let params: string = [
        `format=json`,
        `limit=${limit}`,
        `offset=0`,
      ].join('&');

      this.next = `${CrowdService.API_URL}?${params}`;
    } else {
      this.next = url;
    }

    return this.http.get(this.next).map((res: Response) => res.json());
  }
}

export var crowdServiceInjectables: Array<any> = [
  { provide: CrowdService, useClass: CrowdService }
];
