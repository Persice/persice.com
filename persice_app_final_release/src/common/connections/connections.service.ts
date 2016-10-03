import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Person } from '../models/person/index';
import { HttpClient } from '../core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

interface Connections {
  connections: any[];
  connectionsTotalCount: number;
}

@Injectable()
export class ConnectionsService {
  static API_URL: string = '/api/v1/connections/';
  next: string = '';

  public connections$: Observable<Connections>;

  private _connections$: BehaviorSubject<Connections> = new BehaviorSubject({
    connections: [],
    connectionsTotalCount: 0
  });

  constructor(public http: HttpClient) {
    this.connections$ = this._connections$.asObservable();
  }

  public getForPreview(limit: number): void {

    // Set API url and params
    const params: string = [
      `format=json`,
      `limit=${limit}`,
      `offset=0`
    ].join('&');

    let apiUrl = `${ConnectionsService.API_URL}?${params}`;

    let subs$: Subscription = this.http.get(apiUrl)
      .map((res: Response) => this._mapResponse(res))
      .subscribe((data: Connections) => {

        const connectionsList: any[] = [ ...data.connections ];

        this._connections$.next({
          connections: connectionsList,
          connectionsTotalCount: data.connectionsTotalCount
        });

      }, (err) => { // Error handler
        console.log('Could not load connections for preview');
        console.log(err);
      }, () => { // When finished
        subs$.unsubscribe();
      });
  }

  public get(url: string, limit: number, filter?: boolean): Observable<any> {
    if (url === '') {
      let params: string = [
        `format=json`,
        `limit=${limit}`,
        `filter=${filter !== undefined ? filter : true}`,
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

  private _mapResponse(response: Response): Connections {
    const dto: any = response.json();

    // Parse API response.
    let totalCount: number = dto.meta.total_count;
    let personsList: any[] = dto.objects.map((data) => this._toPerson(data));

    let data: Connections = {
      connections: personsList,
      connectionsTotalCount: totalCount
    };

    return data;

  }

  private _toPerson(dto: any): Person {
    let person: Person = new Person(dto);
    return person;
  }

}

export var connectionsServiceInjectables: Array<any> = [
  { provide: ConnectionsService, useClass: ConnectionsService }
];
