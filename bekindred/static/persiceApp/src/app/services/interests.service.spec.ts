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

import {InterestsService} from './interests.service';
import {interests} from './interests.service.mock';

describe('InterestsService', () => {

  let injector: Injector;
  let backend: MockBackend;
  let response;
  let connection;

  let service: InterestsService;

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
      provide(InterestsService, {
        useFactory: (
          http: HttpClient
        ) => {
          return new InterestsService(http);
        },
        deps: [
          Http
        ]
      })
    ]);

    backend = injector.get(MockBackend);
    service = injector.get(InterestsService);

  });

  afterEach(() => backend.verifyNoPendingRequests());

  it('should find resource', (done: Function) => {
    ensureCommunication(backend, RequestMethod.Get, interests);
    service.get('', 10)
      .subscribe(resp => {
        expect(resp).toEqual(interests);
        done();
      });
  });

  it('should find and filter of resource', (done: Function) => {
    ensureCommunication(backend, RequestMethod.Get, interests);
    service.find('angular')
      .subscribe(resp => {
        expect(resp).toEqual(interests);
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
