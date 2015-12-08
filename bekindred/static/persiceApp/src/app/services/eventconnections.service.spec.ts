/// <reference path="../../typings/_custom.d.ts" />

// TODO: add tests for observers

import {Injector, provide} from 'angular2/angular2';

import {afterEach, beforeEach, describe, expect, inject, injectAsync, it,
beforeEachProviders
} from 'angular2/testing';

import {BaseRequestOptions, ConnectionBackend, Http, Response,
ResponseOptions
} from 'angular2/http';

import {RequestMethod} from 'angular2/src/http/enums';

import { MockBackend } from 'angular2/http/testing';

import {EventConnectionsService} from './eventconnections.service';
import {connections} from './eventconnections.service.mock';

describe('EventConnectionsService', () => {

  let injector: Injector;
  let backend: MockBackend;
  let response;
  let connection;

  let service: EventConnectionsService;

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
      provide(EventConnectionsService, {
        useFactory: (
          http: Http
        ) => {
          return new EventConnectionsService(http);
        },
        deps: [
          Http
        ]
      })
    ]);

    backend = injector.get(MockBackend);
    service = injector.get(EventConnectionsService);

  });

  afterEach(() => backend.verifyNoPendingRequests());

  it('should find resource', (done: Function) => {
    ensureCommunication(backend, RequestMethod.Get, connections);
    service.get('', 1000, '')
      .subscribe(resp => {
        expect(resp).toBe(connections);
        done();
      });
  });

  function ensureCommunication(backend: MockBackend, reqMethod: RequestMethod, expectedBody: string | Object) {
    backend.connections.subscribe((c: any) => {
      expect(c.request.method).toBe(reqMethod);
      c.mockRespond(new Response(new ResponseOptions({ body: expectedBody })));
    });
  }

});
