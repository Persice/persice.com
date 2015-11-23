/// <reference path="../../typings/_custom.d.ts" />

// TODO: add tests for observers

import {Injector, provide} from 'angular2/angular2';

import {afterEach, beforeEach, describe, expect, inject, injectAsync, it,
beforeEachProviders
} from 'angular2/testing';

import {BaseRequestOptions, ConnectionBackend, Http, MockBackend, Response,
ResponseOptions, RequestMethods
} from 'angular2/http';

import {FriendService} from './friend.service';
import {friends, friend} from './friend.service.mock';

describe('FriendService', () => {

  let injector: Injector;
  let backend: MockBackend;
  let response;
  let connection;

  let service: FriendService;

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
      provide(FriendService, {
        useFactory: (
          http: Http
        ) => {
          return new FriendService(http);
        },
        deps: [
          Http
        ]
      })
    ]);

    backend = injector.get(MockBackend);
    service = injector.get(FriendService);

  });

  afterEach(() => backend.verifyNoPendingRequests());

  it('should find resource', (done: Function) => {
    ensureCommunication(backend, RequestMethods.Get, friends);
    service.get('', 12)
      .subscribe(resp => {
        expect(resp).toBe(friends);
        done();
      });
  });

  it('should save friendship', (done: Function) => {
    ensureCommunication(backend, RequestMethods.Post, friend);
    service.saveFriendship(11, -1)
      .subscribe(resp => {
        expect(resp).toBe(friend);
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
