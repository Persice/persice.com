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

import {SearchService} from './search.service';
import {searchResultsUsers, searchResultsEvents} from './search.service.mock';

describe('SearchService', () => {

  let injector: Injector;
  let backend: MockBackend;
  let response;
  let connection;

  let service: SearchService;

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
      provide(SearchService, {
        useFactory: (
          http: HttpClient
        ) => {
          return new SearchService(http);
        },
        deps: [
          Http
        ]
      })
    ]);

    backend = injector.get(MockBackend);
    service = injector.get(SearchService);

  });

  afterEach(() => backend.verifyNoPendingRequests());

  it('should find users resource by first name', (done: Function) => {
    ensureCommunication(backend, RequestMethod.Get, searchResultsUsers);
    service.search('mike', 'user')
      .subscribe(resp => {
        expect(resp).toBe(searchResultsUsers);
        done();
      });
  });

  it('should find events resource by name', (done: Function) => {
    ensureCommunication(backend, RequestMethod.Get, searchResultsEvents);
    service.search('angular', 'event')
      .subscribe(resp => {
        expect(resp).toBe(searchResultsEvents);
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
