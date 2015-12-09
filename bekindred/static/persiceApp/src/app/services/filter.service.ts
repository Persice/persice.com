import { provide, Injectable } from 'angular2/angular2';
import { Http, Response } from 'angular2/http';

import * as Rx from 'rxjs';
import {Observable} from 'rxjs';

import {InterfaceFilter} from '../models/filter.model';
import {OPTS_REQ_JSON_CSRF} from '../core/http_constants';

import {remove, find} from 'lodash';

@Injectable()
export class FilterService {
  static API_URL: string = '/api/v1/filter/state2/';

  static DEFAULT_FILTERS: InterfaceFilter = {
    cumulative_match_score: 0,
    distance: 10000,
    distance_unit: 'miles',
    keyword: '',
    gender: 'm,f',
    min_age: '25',
    max_age: '60',
    order_criteria: 'match_score'
  };

  observers: any[] = [];

  constructor(private http: Http) {

  }

  addObserver(name: string) {
    let obs = { name: '', subject: null };
    obs.name = name;
    obs.subject = new Rx.Subject(null);
    this.observers.push(obs);
  };

  removeObserver(name: string) {
    remove(this.observers, (o) => {
      return o.name === name;
    });
  }

  observer(name: string) {
    let obs = find(this.observers, (o) => {
      return o.name === name;
    });
    return obs.subject;
  }

  public find(): Observable<any> {

    let params: string = [
      `format=json`
    ].join('&');

    let url = `${FilterService.API_URL}?${params}`;

    return this.http.get(url).map((res: Response) => res.json());
  }

  public getDefaultState(): InterfaceFilter {

    return FilterService.DEFAULT_FILTERS;

  }

  public findOneByUri(resourceUri: string): Observable<any> {
    return this.http.get(resourceUri).map((res: Response) => res.json());
  }

  public updateOne(resourceUri: string, data: any): Observable<any> {
    const body = JSON.stringify(data);
    return this.http.patch(
      resourceUri,
      body,
      OPTS_REQ_JSON_CSRF)
      .map((res: Response) => res.json());
  }

  public publishObservers() {
    for (var i = this.observers.length - 1; i >= 0; i--) {
      let name = this.observers[i].name;
      let subject = this.observers[i].subject;
      subject.next(name + ' filters:modified');
    }
  }


}
export var filterServiceInjectables: Array<any> = [
  provide(FilterService, { useClass: FilterService })
];
