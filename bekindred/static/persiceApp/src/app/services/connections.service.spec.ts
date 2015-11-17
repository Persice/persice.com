/// <reference path="../../typings/_custom.d.ts" />

// TODO: add tests for observers

import {Injector, provide} from 'angular2/angular2';

import {afterEach, beforeEach, describe, expect, inject, injectAsync, it,
beforeEachProviders
}from 'angular2/testing';

import {BaseRequestOptions, ConnectionBackend, Http, MockBackend, Response,
ResponseOptions, RequestMethods
} from 'angular2/http';

import {ConnectionsService} from './connections.service';
import {connections} from './connections.service.mock';

describe('ConnectionsService', () => {

  let injector: Injector;
  let backend: MockBackend;
  let response;
  let connection;

  let service: ConnectionsService;

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
      provide(ConnectionsService, {
        useFactory: (
          http: Http
        ) => {
          return new ConnectionsService(http);
        },
        deps: [
          Http
        ]
      })
    ]);

    backend = injector.get(MockBackend);
    service = injector.get(ConnectionsService);

  });

  afterEach(() => backend.verifyNoPendingRequests());

  it('should find resource', (done: Function) => {
    ensureCommunication(backend, RequestMethods.Get, connections);
    service.get('', 12, true)
      .subscribe(resp => {
        expect(resp).toBe(connections);
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
