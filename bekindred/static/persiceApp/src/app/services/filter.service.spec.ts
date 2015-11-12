/// <reference path="../../typings/_custom.d.ts" />

// TODO: add tests for observers

import {Injector, provide} from 'angular2/angular2';

import {afterEach, beforeEach, describe, expect, inject, injectAsync, it,
beforeEachProviders
}from 'angular2/testing';

import {BaseRequestOptions, ConnectionBackend, Http, MockBackend, Response,
ResponseOptions, RequestMethods
} from 'angular2/http';

import {FilterService} from './filter.service';
import {FilterModel, InterfaceFilter} from '../models/filter.model';
import {filters, filter, defaultFilters} from './filter.mock';

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


  it('should be able to get default state', (done: Function) => {
    let res = filterService.getDefaultState();
    expect(res).toEqual(defaultFilters);
    done();
  });

  it('should perform find resource', (done: Function) => {
    ensureCommunication(backend, RequestMethods.Get, filters);
    filterService.find()
      .subscribe(resp => {
        expect(resp).toBe(filters);
        done();
      });
  });

  it('should perform update one resource by uri', (done: Function) => {
    ensureCommunication(backend, RequestMethods.Patch, filter);
    filterService.updateOne(filter.resource_uri, filter).subscribe((resp: InterfaceFilter) => {
      expect(resp).toBe(filter);
      done();
    });
  });

  it('should perform find one resource by uri', (done: Function) => {
    ensureCommunication(backend, RequestMethods.Get, filter);
    filterService.findOneByUri(filter.resource_uri).subscribe((resp: InterfaceFilter) => {
      expect(resp).toBe(filter);
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
