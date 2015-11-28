/// <reference path="../../typings/_custom.d.ts" />

// TODO: add tests for observers

import {Injector, provide} from 'angular2/angular2';

import {afterEach, beforeEach, describe, expect, inject, injectAsync, it,
beforeEachProviders
} from 'angular2/testing';

import {BaseRequestOptions, ConnectionBackend, Http, MockBackend, Response,
ResponseOptions, RequestMethods
} from 'angular2/http';

import {KeywordsService} from './keywords.service';
import {keywords} from './keywords.service.mock';

describe('KeywordsService', () => {

  let injector: Injector;
  let backend: MockBackend;
  let response;
  let connection;

  let service: KeywordsService;

  beforeEach(() => {
    injector = Injector.resolveAndCreate([
      BaseRequestOptions,
      MockBackend,
      provide(Http, {
        useFactory: (connectionBackend: ConnectionBackend,
          defaultOptions: BaseRequestOptions) => {
          return new Http(connectionBackend, defaultOptions);
        },
        deps: [
          MockBackend,
          BaseRequestOptions
        ]
      }),
      provide(KeywordsService, {
        useFactory: (
          http: Http
        ) => {
          return new KeywordsService(http);
        },
        deps: [
          Http
        ]
      })
    ]);

    backend = injector.get(MockBackend);
    service = injector.get(KeywordsService);

  });

  afterEach(() => backend.verifyNoPendingRequests());

  it('should find resource', (done: Function) => {
    ensureCommunication(backend, RequestMethods.Get, keywords);
    service.get()
      .subscribe(resp => {
        expect(resp).toEqual(keywords);
        done();
      });
  });

  it('should find and filter of resource', (done: Function) => {
    ensureCommunication(backend, RequestMethods.Get, keywords);
    service.find('angular', 100)
      .subscribe(resp => {
        expect(resp).toEqual(keywords);
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
