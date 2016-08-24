import { Injector, provide, ReflectiveInjector } from '@angular/core';
import { afterEach, beforeEach, describe, expect, it } from '@angular/core/testing';
import { BaseRequestOptions, ConnectionBackend, Http, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { ConnectionsService } from './connections.service';
import { MockConnections } from './connections.mock';
import { HttpClient } from '../core/http-client';

describe('Connections service', () => {

  let injector: Injector;
  let backend: MockBackend;
  let service: ConnectionsService;

  beforeEach(() => {
    injector = ReflectiveInjector.resolveAndCreate([
      BaseRequestOptions,
      MockBackend,
      HttpClient,
      provide(Http, {
        useFactory: (
          connectionBackend: ConnectionBackend,
          defaultOptions: BaseRequestOptions
        ) => {
          return new Http(connectionBackend, defaultOptions);
        },
        deps: [
          MockBackend,
          BaseRequestOptions
        ]
      }),
      provide(ConnectionsService, {
        useFactory: (
          http: HttpClient
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
    ensureCommunication(backend, RequestMethod.Get, MockConnections);
    service.get('', 12)
      .subscribe(resp => {
        expect(resp).toBe(MockConnections);
        done();
      });
  });

  function ensureCommunication(backend: MockBackend, reqMethod: RequestMethod, expectedBody: string | Object) {
    backend.connections.subscribe((c: any) => {
      expect(c.request.method).toBe(reqMethod);
      c.mockRespond(new Response(new ResponseOptions({body: expectedBody})));
    });
  }

});
