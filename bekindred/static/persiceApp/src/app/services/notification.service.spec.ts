import {Injector, provide} from 'angular2/core';

import {afterEach, beforeEach, describe, expect, inject, injectAsync, it,
beforeEachProviders
} from 'angular2/testing';


import {NotificationService} from './notification.service';

describe('NotificationService', () => {

  let injector: Injector;


  let service: NotificationService;

  beforeEach(() => {
    injector = Injector.resolveAndCreate([
      provide(NotificationService, {
        useFactory: (

        ) => {
          return new NotificationService();
        },
        deps: [

        ]
      })
    ]);

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
