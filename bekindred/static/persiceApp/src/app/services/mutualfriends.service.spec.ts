/// <reference path="../../typings/_custom.d.ts" />

// TODO: add tests for observers

import {Injector, provide} from 'angular2/angular2';

import {afterEach, beforeEach, describe, expect, inject, injectAsync, it,
beforeEachProviders
} from 'angular2/testing';

import {BaseRequestOptions, ConnectionBackend, Http, Response,
ResponseOptions
} from 'angular2/http';

import {RequestMethod} from 'angular2/src/http/enums';
import { MockBackend } from 'angular2/http/testing';

import {MutualFriendsService} from './mutualfriends.service';
import {mutualfriends} from './mutualfriends.service.mock';

describe('MutualFriendsService', () => {

  let injector: Injector;
  let backend: MockBackend;
  let response;
  let connection;

  let service: MutualFriendsService;

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
      provide(MutualFriendsService, {
        useFactory: (
          http: Http
        ) => {
          return new MutualFriendsService(http);
        },
        deps: [
          Http
        ]
      })
    ]);

    backend = injector.get(MockBackend);
    service = injector.get(MutualFriendsService);

  });

  afterEach(() => backend.verifyNoPendingRequests());

  it('should find resource', (done: Function) => {
    ensureCommunication(backend, RequestMethod.Get, mutualfriends);
    service.get('', 12, 1)
      .subscribe(resp => {
        expect(resp).toEqual(mutualfriends);
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
