/// <reference path="../../typings/_custom.d.ts" />

import {
Injector,
provide,
Inject
} from 'angular2/angular2';

import {
afterEach,
beforeEach,
describe,
expect,
injectAsync,
it
} from 'angular2/testing';


import {
MockBackend,
MockConnection,
ConnectionBackend,
BaseRequestOptions,
ResponseOptions,
Response,
Http
} from 'angular2/http';

import {FilterService} from './filter.service';
import {FilterModel, InterfaceFilter} from '../models/filter.model';

describe('Filter Service', () => {

  let injector: Injector;
  let backend: MockBackend;
  let response;

  let filterService: FilterService;

  let API_URL: string = '/api/v1/filter/state2/';

  let DEFAULT_FILTERS: InterfaceFilter = {
    distance: 10000,
    distance_unit: 'miles',
    keyword: '',
    gender: 'm,f',
    min_age: '25',
    max_age: '60',
    order_criteria: 'match_score'
  };

  beforeEach(() => {
    injector = Injector.resolveAndCreate([
      BaseRequestOptions,
      MockBackend,
      provide(Http, {
        useFactory: (connectionBackend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
          return new Http(connectionBackend, defaultOptions);
        },
        deps: [
          MockBackend,
          BaseRequestOptions
        ]
      }),
      provide(FilterService, {
        useFactory: (
          http: Http,
          API_URL: string,
          DEFAULT_FILTERS: InterfaceFilter
        ) => {
          return new FilterService(http, API_URL, DEFAULT_FILTERS);
        },
        deps: [
          Http,
          API_URL,
          DEFAULT_FILTERS
        ]
      })
    ]);

    backend = injector.get(MockBackend);
    filterService = injector.get(FilterService);
    response = new Response(
      new ResponseOptions({ body: 'base response' })
    );

  });

  afterEach(() => backend.verifyNoPendingRequests());


  it('should do something with filter service', injectAsync([FilterService], (filterService) => {
    // filterService.done();
    expect(true).toBe(true);
  }));

});
