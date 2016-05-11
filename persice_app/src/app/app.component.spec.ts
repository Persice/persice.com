import {provide} from '@angular/core';

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
import {SpyLocation} from '@angular/common/testing';
import {RootRouter} from '@angular/router-deprecated/src/router';
import {Location} from '@angular/common';

import {AppComponent} from "./app.component";

describe('App component', () => {
  var location, router;

  beforeEachProviders(() => [
    RouteRegistry,
    provide(Location, { useClass: SpyLocation }),
    provide(Router, { useClass: RootRouter }),
    provide(ROUTER_PRIMARY_COMPONENT, { useValue: AppComponent })
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

  it('Should be able to navigate to Events', done => {
    router.navigateByUrl('/events').then(() => {
      expect(location.path()).toBe('/events');
      done();
    }).catch(e => done.fail(e));
  });

  it('Should be able to navigate to Messages', done => {
    router.navigate(['Messages']).then(() => {
      expect(location.path()).toBe('/messages/new/');
      done();
    }).catch(e => done.fail(e));
  });
});
