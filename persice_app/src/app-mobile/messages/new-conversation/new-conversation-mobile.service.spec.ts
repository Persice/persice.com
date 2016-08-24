import { Injector, ReflectiveInjector } from '@angular/core';
import { HttpClient } from '../../../common/core';
import { Http, ConnectionBackend, BaseRequestOptions, RequestMethod, ResponseOptions, Response } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { NewConversationMobileService } from './new-conversation-mobile.service';

describe('New conversation mobile service', () => {

  let injector: Injector;
  let backend: MockBackend;
  let service: NewConversationMobileService;

  beforeEach(() => {
    injector = ReflectiveInjector.resolveAndCreate([
      BaseRequestOptions,
      MockBackend,
      HttpClient,
      {
        provide: Http,
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
      },
      {
        provide:
        NewConversationMobileService,
        useFactory: (
          http: HttpClient
        ) => {
          return new NewConversationMobileService(http);
        },
        deps: [
          Http
        ]
      }
    ]);

    backend = injector.get(MockBackend);
    service = injector.get(NewConversationMobileService);
  });

  it('sends a message', (done: Function) => {
    // given
    var expectedBody = {
      body: 'any message',
      recipient: '1',
      sender: '2'
    };
    mockResponse(backend, RequestMethod.Post, expectedBody);

    // then
    service.sendMessage('1', 'any message')
      .subscribe(resp => {
        expect(resp).toBe(expectedBody);
        done();
      });
  });

  it('sets flags on success', (done: Function) => {
    // when
    service.messageSent();

    // then
    expect(service.sendingInProgress).toBe(false);
    done();
  });

  it('sets flags on failure', (done: Function) => {
    // when
    service.messageNotSent();

    // then
    expect(service.sendingInProgress).toBe(false);
    done();
  });

  function mockResponse(backend: MockBackend, reqMethod: RequestMethod, expectedBody: string | Object) {
    backend.connections.subscribe((c: any) => {
      expect(c.request.method).toBe(reqMethod);
      c.mockRespond(new Response(new ResponseOptions({ body: expectedBody })));
    });
  }
});
