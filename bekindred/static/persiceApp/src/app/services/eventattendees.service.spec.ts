import {Injector, provide} from 'angular2/core';

import {afterEach, beforeEach, describe, expect, inject, injectAsync, it,
beforeEachProviders
} from 'angular2/testing';

import {BaseRequestOptions, ConnectionBackend, Http, Response,
ResponseOptions
} from 'angular2/http';

import {HttpClient} from '../core/http_client';

import {RequestMethod} from 'angular2/src/http/enums';

import { MockBackend } from 'angular2/http/testing';

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
      HttpClient,
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
          http: HttpClient
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
    ensureCommunication(backend, RequestMethod.Get, attendees);
    service.get('', 12, 112, 'yes', '')
      .subscribe(resp => {
        expect(resp).toBe(attendees);
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
