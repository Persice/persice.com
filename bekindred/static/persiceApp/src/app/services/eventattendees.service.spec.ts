/// <reference path="../../typings/_custom.d.ts" />

// TODO: add tests for observers

import {Injector, provide} from 'angular2/angular2';

import {afterEach, beforeEach, describe, expect, inject, injectAsync, it,
beforeEachProviders
} from 'angular2/testing';

import {BaseRequestOptions, ConnectionBackend, Http, MockBackend, Response,
ResponseOptions, RequestMethods
} from 'angular2/http';

import {EventAttendeesService} from './eventattendees.service';
import {attendees} from './eventattendees.service.mock';

describe('EventAttendeesService', () => {

  let injector: Injector;
  let backend: MockBackend;
  let response;
  let connection;

  let service: EventAttendeesService;

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
      provide(EventAttendeesService, {
        useFactory: (
          http: Http
        ) => {
          return new EventAttendeesService(http);
        },
        deps: [
          Http
        ]
      })
    ]);

    backend = injector.get(MockBackend);
    service = injector.get(EventAttendeesService);

  });

  afterEach(() => backend.verifyNoPendingRequests());

  it('should find resource', (done: Function) => {
    ensureCommunication(backend, RequestMethods.Get, attendees);
    service.get('', 12, 112, 'yes', '')
      .subscribe(resp => {
        expect(resp).toBe(attendees);
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
