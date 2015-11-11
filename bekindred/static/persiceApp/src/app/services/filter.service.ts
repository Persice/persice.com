/// <reference path="../../typings/_custom.d.ts" />

import {provide, Injectable} from 'angular2/angular2';
import {Http, Response} from 'angular2/http';
import * as Rx from '@reactivex/rxjs';

import {FilterModel, InterfaceFilter} from '../models/filter.model';
import {OPTS_REQ_JSON_CSRF} from '../core/http_constants';

import {remove, find} from 'lodash';

let API_URL = '/api/v1/filter/state2/';

let DEFAULT_FILTERS: InterfaceFilter = {
  distance: 10000,
  distance_unit: 'miles',
  keyword: '',
  gender: 'm,f',
  min_age: '25',
  max_age: '60',
  order_criteria: 'match_score'
};

@Injectable()
export class FilterService {
  _filters: FilterModel;
  timeoutIdFiltersSave;
  timeoutIdFiltersEvent;
  observers: any[] = [];
  defaultFilters: InterfaceFilter = DEFAULT_FILTERS;
  apiUrl: string = API_URL;

  constructor(
    private http: Http
  ) {

  }

  addObserver(name) {
    let obs = { name: '', subject: null };
    obs.name = name;
    obs.subject = new Rx.Subject(null);
    this.observers.push(obs);
  };

  removeObserver(name) {
    remove(this.observers, (o) => {
      return o.name === name;
    });
  }

  observer(name) {
    let obs = find(this.observers, (o) => {
      return o.name === name;
    });
    return obs.subject;
  }

  public get(): Rx.Observable<any> {

    let params: string = [
      `format=json`
    ].join('&');

    let url = `${this.apiUrl}?${params}`;

    return this.http.get(url).map((res: Response) => res.json());
  }

  public getDefaultState() {
    return this.defaultFilters;
  }


  public save(resourceUri, data) {
    const body = JSON.stringify(data);

    if (this.timeoutIdFiltersSave) window.clearTimeout(this.timeoutIdFiltersSave);
    this.timeoutIdFiltersSave = window.setTimeout(
      () => {
        this.http.patch(
          resourceUri,
          body,
          OPTS_REQ_JSON_CSRF)
          .map((res: Response) => res.json())
          .subscribe(res => {
            if (this.timeoutIdFiltersEvent) window.clearTimeout(this.timeoutIdFiltersEvent);
            this.timeoutIdFiltersEvent = window.setTimeout(
              () => {
                for (var i = this.observers.length - 1; i >= 0; i--) {
                  let name = this.observers[i].name;
                  let subject = this.observers[i].subject;
                  subject.next(name + ' filters:modified');
                }
              },
              250
            );

          });
      },
      500
    );


  }


}
export var filterServiceInjectables: Array<any> = [
  provide(FilterService, { useClass: FilterService })
];
