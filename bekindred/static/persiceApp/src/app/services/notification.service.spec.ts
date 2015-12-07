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

import {NotificationService} from './notification.service';

describe('NotificationService', () => {

  let injector: Injector;
  let backend: MockBackend;
  let response;
  let connection;

  let service: NotificationService;

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
      provide(NotificationService, {
        useFactory: (

        ) => {
          return new NotificationService();
        },
        deps: [

        ]
      })
    ]);

    backend = injector.get(MockBackend);
    service = injector.get(NotificationService);

  });


  it('should add notification', () => {
    service.addObserver('crowd');
    let observer = service.hasObserver('crowd');
    expect(observer).toBe(true);
  });

  it('should remove notification', () => {
    service.addObserver('crowd');
    service.removeObserver('crowd');
    let observer = service.hasObserver('crowd');
    expect(observer).toBe(false);
  });


});
