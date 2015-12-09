import {Injector, provide} from 'angular2/angular2';

import {afterEach, beforeEach, describe, expect, inject, injectAsync, it,
beforeEachProviders
} from 'angular2/testing';

import {BaseRequestOptions, ConnectionBackend, Http, Response,
ResponseOptions
} from 'angular2/http';

import {RequestMethod} from 'angular2/src/http/enums';
import { MockBackend } from 'angular2/http/testing';

import {EventMessagesService} from './eventmessages.service';
import {messages, message} from './eventmessages.service.mock';

describe('EventMessagesService', () => {

  let injector: Injector;
  let backend: MockBackend;
  let response;
  let connection;

  let service: EventMessagesService;

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
      provide(EventMessagesService, {
        useFactory: (
          http: Http
        ) => {
          return new EventMessagesService(http);
        },
        deps: [
          Http
        ]
      })
    ]);

    backend = injector.get(MockBackend);
    service = injector.get(EventMessagesService);

  });

  afterEach(() => backend.verifyNoPendingRequests());

  it('should find resource', (done: Function) => {
    ensureCommunication(backend, RequestMethod.Get, messages);
    service.get('', 12, 12)
      .subscribe(resp => {
        expect(resp).toBe(messages);
        done();
      });
  });

  it('should find one resource by uri', (done: Function) => {
    ensureCommunication(backend, RequestMethod.Get, message);
    service.findOneByUri(message['resource_uri']).subscribe((resp: any) => {
      expect(resp).toBe(message);
      done();
    });
  });

  it('should find one resource by id', (done: Function) => {
    ensureCommunication(backend, RequestMethod.Get, message);
    service.findOneByUri(message['id']).subscribe((resp: any) => {
      expect(resp).toBe(message);
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
