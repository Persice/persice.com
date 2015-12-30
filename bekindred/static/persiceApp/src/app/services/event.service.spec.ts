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
      provide(EventService, {
        useFactory: (
          http: HttpClient
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
    ensureCommunication(backend, RequestMethod.Get, events);
    service.get('', 12)
      .subscribe(resp => {
        expect(resp).toBe(events);
        done();
      });
  });

  it('should find one resource by uri', (done: Function) => {
    ensureCommunication(backend, RequestMethod.Get, event);
    service.findOneByUri(event['resource_uri']).subscribe((resp: any) => {
      expect(resp).toBe(event);
      done();
    });
  });

  it('should find one resource by id', (done: Function) => {
    ensureCommunication(backend, RequestMethod.Get, event);
    service.findOneByUri(event['id']).subscribe((resp: any) => {
      expect(resp).toBe(event);
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
