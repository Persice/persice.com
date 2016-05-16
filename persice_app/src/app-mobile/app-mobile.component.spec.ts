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

import {AppMobileComponent} from "./app-mobile.component";

describe('App component mobile', () => {

  var location, router;

  beforeEachProviders(() => [
    RouteRegistry,
    provide(Location, {useClass: SpyLocation}),
    provide(Router, {useClass: RootRouter}),
    provide(ROUTER_PRIMARY_COMPONENT, {useValue: AppMobileComponent})
  ]);

  beforeEach(inject([Router, Location], (r, l) => {
    router = r;
    location = l;
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
    router.navigate(['MyProfile', {'username': 'johndoe' }]).then(() => {
      expect(location.path()).toBe('/johndoe');
      done();
    }).catch(e => done.fail(e));
  });
});

