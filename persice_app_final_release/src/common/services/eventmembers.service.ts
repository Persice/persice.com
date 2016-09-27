import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { HttpClient } from '../core/http-client';

@Injectable()
export class EventMembersService {
  static API_URL: string = '/api/v1/member/';

  constructor(private http: HttpClient) { }

  public find(): Observable<any> {

    let params: string = [
      `format=json`
    ].join('&');

    let url = `${EventMembersService.API_URL}?${params}`;

    return this.http.get(url).map((res: Response) => res.json());
  }

  public findOneByUri(resourceUri: string): Observable<any> {
    return this.http.get(resourceUri).map((res: Response) => res.json());
  }

  public updateOneByUri(resourceUri: string, data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.patch(
      resourceUri,
      body)
      .map((res: Response) => res.json());
  }

  public createOne(data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.post(
      EventMembersService.API_URL,
      body)
      .map((res: Response) => res.json());
  }

  public deleteOneByUri(resourceUri: string): Observable<any> {
    return this.http.delete(resourceUri);
  }

}

