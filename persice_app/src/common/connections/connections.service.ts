import {provide, Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {Observable} from 'rxjs';

import {HttpClient} from '../../app/shared/core';

@Injectable()
export class ConnectionsService {
  static API_URL: string = '/api/v1/connections/';
  next: string = '';

  constructor(public http: HttpClient) { }

  public get(url: string, limit: number, filter?: boolean): Observable<any> {

    if (url === '') {
      let params: string = [
        `format=json`,
        `limit=${limit}`,
        `filter=${filter ? filter : true}`,
        `offset=0`,
      ].join('&');

      this.next = `${ConnectionsService.API_URL}?${params}`;
    } else {
      this.next = url;
    }
    return this.http.get(this.next).map((res: Response) => res.json());
  }

  public markNewConnectionsAsSeen(id: number): Observable<any> {
    let url = `/api/v2/new_connections/updated_at/?format=json&friend_id=${id}`;
    return this.http.get(url).map(res => res.json());
  }

}

export var connectionsServiceInjectables: Array<any> = [
  provide(ConnectionsService, { useClass: ConnectionsService })
];
