/// <reference path="../../typings/_custom.d.ts" />

import {Injector, provide} from 'angular2/angular2';

import {afterEach, beforeEach, describe, expect, inject, injectAsync, it,
  beforeEachProviders
}from 'angular2/testing';

import {BaseRequestOptions, ConnectionBackend, Http, MockBackend, Response,
  ResponseOptions, RequestMethods
} from 'angular2/http';

import {FilterService} from './filter.service';
import {FilterModel, InterfaceFilter} from '../models/filter.model';
import {filters} from './filters.mock';

describe('FilterService', () => {

  let injector: Injector;
  let backend: MockBackend;
  let response;
  let connection;

  let filterService: FilterService;

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
          http: Http
          ) => {
          return new FilterService(http);
        },
        deps: [
        Http
        ]
      })
      ]);

    backend = injector.get(MockBackend);
    filterService = injector.get(FilterService);

  });

  afterEach(() => backend.verifyNoPendingRequests());


  it('should perform get request', (done: Function) => {
    ensureCommunication(backend, RequestMethods.Get, filters);

    filterService.get()
    .subscribe(resp => {
      expect(resp).toBe(filters);
      done();
    });

  });

  function ensureCommunication(backend: MockBackend, reqMethod: RequestMethods, expectedBody: string | Object) {
    backend.connections.subscribe((c: any) => {
      expect(c.request.method).toBe(reqMethod);
      c.mockRespond(new Response(new ResponseOptions({ body: expectedBody })));
    });
  }

});
