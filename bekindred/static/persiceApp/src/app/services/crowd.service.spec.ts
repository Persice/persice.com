import {Injector, provide} from 'angular2/angular2';

import {afterEach, beforeEach, describe, expect, inject, injectAsync, it,
beforeEachProviders
} from 'angular2/testing';

import {BaseRequestOptions, ConnectionBackend, Http, Response,
ResponseOptions,
} from 'angular2/http';

import {HttpClient} from '../core/http_client';

import { MockBackend} from 'angular2/http/testing';

import {RequestMethod} from 'angular2/src/http/enums';

import {CrowdService} from './crowd.service';
import {crowd} from './crowd.service.mock';

describe('CrowdService', () => {

  let injector: Injector;
  let backend: MockBackend;
  let response;
  let connection;

  let service: CrowdService;

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
      provide(CrowdService, {
        useFactory: (
          http: HttpClient
        ) => {
          return new CrowdService(http);
        },
        deps: [
          Http
        ]
      })
    ]);

    backend = injector.get(MockBackend);
    service = injector.get(CrowdService);

  });

  afterEach(() => backend.verifyNoPendingRequests());

  it('should find resource', (done: Function) => {
    ensureCommunication(backend, RequestMethod.Get, crowd);
    service.get('', 12, true)
      .subscribe(resp => {
        expect(resp).toBe(crowd);
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
