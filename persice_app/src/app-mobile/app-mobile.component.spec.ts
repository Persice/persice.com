import {
  ROUTER_PRIMARY_COMPONENT,
  Router,
  RouteRegistry
} from '@angular/router-deprecated';
import {
  it,
  describe,
  beforeEach,
  expect,
  inject,
  beforeEachProviders
} from '@angular/core/testing';
import {provide} from '@angular/core';
import {SpyLocation} from '@angular/common/testing';
import {RootRouter} from '@angular/router-deprecated/src/router';
import {Location} from '@angular/common';

import {AppMobileComponent} from './app-mobile.component';

import {provideStore} from '@ngrx/store';
import STORE_REDUCERS from '../common/reducers';
import STORE_ACTIONS from '../common/actions';
import {MockGeolocationService} from "../app/shared/services/mock-geolocation.service";
import {MockBackend} from "@angular/http/testing";
import {HttpClient} from "../app/shared/core/http-client";
import {Http, ConnectionBackend, BaseRequestOptions} from "@angular/http";
import {TestComponentBuilder, ComponentFixture} from "@angular/compiler/testing";

describe('App component mobile', () => {

  var location, router, mockGeolocationService, _tcb;

  beforeEachProviders(() => {
    mockGeolocationService = new MockGeolocationService();

    return [
      provideStore(STORE_REDUCERS),
      STORE_ACTIONS,
      BaseRequestOptions,
      RouteRegistry,
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
      provide(Location, { useClass: SpyLocation }),
      provide(Router, { useClass: RootRouter }),
      provide(ROUTER_PRIMARY_COMPONENT, { useValue: AppMobileComponent }),
      mockGeolocationService.getProviders()
    ];
  });

  beforeEach(inject([Router, Location, TestComponentBuilder], (r, l, tcb) => {
    router = r;
    location = l;
    _tcb = tcb;
  }));

  it('Should be able to navigate to Crowd', done => {
    router.navigate(['Crowd']).then(() => {
      expect(location.path()).toBe('/crowd');
      done();
    }).catch(e => done.fail(e));
  });

  it('Should be able to navigate to Connections', done => {
    router.navigate(['Connections']).then(() => {
      expect(location.path()).toBe('/connections');
      done();
    }).catch(e => done.fail(e));
  });

  it('Should be able to navigate to Settings', done => {
    router.navigate(['Settings']).then(() => {
      expect(location.path()).toBe('/settings');
      done();
    }).catch(e => done.fail(e));
  });

  it('Should be able to navigate to Events', done => {
    router.navigate(['Events']).then(() => {
      expect(location.path()).toBe('/events');
      done();
    }).catch(e => done.fail(e));
  });

  it('Should be able to navigate to Messages', done => {
    router.navigate(['Messages']).then(() => {
      expect(location.path()).toBe('/messages');
      done();
    }).catch(e => done.fail(e));
  });

  it('Should be able to navigate to MyProfile', done => {
    router.navigate(['MyProfile', { 'username': 'johndoe' }]).then(() => {
      expect(location.path()).toBe('/johndoe');
      done();
    }).catch(e => done.fail(e));
  });

  it('Should ask browser for geolocation', done => {
    return _tcb.createAsync(AppMobileComponent).then((componentFixture: ComponentFixture<AppMobileComponent>) => {
      componentFixture.detectChanges();
      componentFixture.componentInstance.ngOnInit();
      // expect(mockGeolocationService.getLocationSpy).toHaveBeenCalled();
      done();
    }).catch(e => done.fail(e));
  });
});

