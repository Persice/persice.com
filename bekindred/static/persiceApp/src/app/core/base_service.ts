import {Http, Response} from 'angular2/http';

import {Observable} from 'rxjs/Observable';

import {OPTS_REQ_JSON} from './http_constants';
import {BaseDto} from './dto';
import {HttpClient} from './http_client';


export abstract class BaseResourceService<T extends BaseDto> {

  protected url: string;

  constructor(protected http: HttpClient, resourceName: string) {
    this.url = `/api/${resourceName}`;
  }

  createOne(data: T): Observable<T> {
    const body = JSON.stringify(data);
    return this.http.post(this.url, body, OPTS_REQ_JSON).map((res: Response) => res.json());
  }

  updateOne(data: T): Observable<T> {
    const body = JSON.stringify(data);
    return this.http.put(`${this.url}/${data._id}`, body, OPTS_REQ_JSON).map((res: Response) => res.json());
  }

  removeOneById(id: string): Observable<T> {
    return this.http.delete(`${this.url}/${id}`).map((res: Response) => res.json());
  }

  findOneById(id: string): Observable<T> {
    return this.http.get(`${this.url}/${id}`).map((res: Response) => res.json());
  }

  findOneByUri(uri: string): Observable<T> {
    return this.http.get(`${uri}`).map((res: Response) => res.json());
  }

  // find(): Observable<T[]> {
  //   return this.http.get(`${this.url}/_find`).map((res: Response) => res.json());
  // }

}

