/// <reference path="../../typings/_custom.d.ts" />

import {provide, Inject, Injectable, EventEmitter} from 'angular2/angular2';
import {Http, Headers, Response, HTTP_BINDINGS, RequestOptions} from 'angular2/http';
import * as Rx from '@reactivex/rxjs';

import {FilterModel, InterfaceFilter} from '../models/filter.model';

import {remove, find} from 'lodash';

let API_URL: string = '/api/v1/filter/state/';

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

  constructor(
    public http: Http,
    @Inject(API_URL) private apiUrl: string,
    @Inject(DEFAULT_FILTERS) private defaultFilters: InterfaceFilter
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

  public get() {

    let params: string = [
      `format=json`
    ].join('&');

    let url = `${this.apiUrl}?${params}`;

    return this.http.get(url);
  }

  public getDefaultState() {
    return this.defaultFilters;
  }


  public save(resourceUri, data) {
    let headers: Headers = new Headers();
    let csrftoken = this.getCookieValue('csrftoken');
    headers.append('X-CSRFToken', csrftoken);
    headers.append('Content-Type', 'application/json');

    let opts: RequestOptions = new RequestOptions();
    opts.headers = headers;

    if (this.timeoutIdFiltersSave) window.clearTimeout(this.timeoutIdFiltersSave);
    this.timeoutIdFiltersSave = window.setTimeout(() => {
      this.http.patch(
        resourceUri,
        JSON.stringify(data),
        opts)
        .map(res => res.json())
        .subscribe(res => {
          if (this.timeoutIdFiltersEvent) window.clearTimeout(this.timeoutIdFiltersEvent);
          this.timeoutIdFiltersEvent = window.setTimeout(() => {
            for (var i = this.observers.length - 1; i >= 0; i--) {
              let name = this.observers[i].name;
              let subject = this.observers[i].subject;
              subject.next(name + ' filters:modified');
            }
          }, 250);

        });
    }, 500);


  }

  private getCookieValue(name) {
    let value = '; ' + document.cookie;
    let parts = value.split('; ' + name + '=');
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

}
export var filterServiceInjectables: Array<any> = [
  provide(FilterService, { useClass: FilterService }),
  provide(API_URL, { useValue: API_URL }),
  provide(DEFAULT_FILTERS, { useValue: DEFAULT_FILTERS })
];
