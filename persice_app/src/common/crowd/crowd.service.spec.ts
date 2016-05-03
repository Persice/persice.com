import {Injector, provide, ReflectiveInjector} from '@angular/core';

import {afterEach, beforeEach, describe, expect, inject, injectAsync, it,
  beforeEachProviders
} from '@angular/core/testing';

import {BaseRequestOptions, ConnectionBackend, Http, Response, ResponseOptions}
from '@angular/http';

import {MockBackend} from '@angular/http/testing';
import {RequestMethod} from '@angular/http';
import {CrowdService} from './crowd.service';
import {MockCrowd} from './crowd.mock';
import {HttpClient} from "../../app/shared/core/http-client";

describe('CrowdService', () => {

  let injector: Injector;
  let backend: MockBackend;
  let response;
  let connection;

  let service: CrowdService;

  beforeEach(() => {
    injector = ReflectiveInjector.resolveAndCreate([
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
    ensureCommunication(backend, RequestMethod.Get, MockCrowd);
    service.get('', 12)
      .subscribe(resp => {
        expect(resp).toBe(MockCrowd);
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
