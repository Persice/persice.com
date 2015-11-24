/// <reference path="../../typings/_custom.d.ts" />

// TODO: add tests for observers

import {Injector, provide} from 'angular2/angular2';

import {afterEach, beforeEach, describe, expect, inject, injectAsync, it,
beforeEachProviders
} from 'angular2/testing';

import {BaseRequestOptions, ConnectionBackend, Http, MockBackend, Response,
ResponseOptions, RequestMethods
} from 'angular2/http';

import {EventService} from './event.service';
import {events, event} from './event.service.mock';

describe('EventService', () => {

  let injector: Injector;
  let backend: MockBackend;
  let response;
  let connection;

  let service: EventService;

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
      provide(EventService, {
        useFactory: (
          http: Http
        ) => {
          return new EventService(http);
        },
        deps: [
          Http
        ]
      })
    ]);

    backend = injector.get(MockBackend);
    service = injector.get(EventService);

  });

  afterEach(() => backend.verifyNoPendingRequests());

  it('should find resource', (done: Function) => {
    ensureCommunication(backend, RequestMethods.Get, events);
    service.get('', 12)
      .subscribe(resp => {
        expect(resp).toBe(events);
        done();
      });
  });

  it('should find one resource by uri', (done: Function) => {
    ensureCommunication(backend, RequestMethods.Get, event);
    service.findOneByUri(event['resource_uri']).subscribe((resp: any) => {
      expect(resp).toBe(event);
      done();
    });
  });

  it('should find one resource by id', (done: Function) => {
    ensureCommunication(backend, RequestMethods.Get, event);
    service.findOneByUri(event['id']).subscribe((resp: any) => {
      expect(resp).toBe(event);
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