import {
  describe,
  it,
  expect,
  inject,
  injectAsync,
  beforeEach,
  beforeEachProviders
} from 'angular2/testing';

import {provide} from 'angular2/core';

import {Router, Location, ROUTER_PRIMARY_COMPONENT} from 'angular2/router';
import {RouteRegistry} from 'angular2/src/router/route_registry';
import {SpyLocation} from 'angular2/src/mock/location_mock';
import {RootRouter} from 'angular2/src/router/router';
import {AppComponent} from './app.component';


describe('Router tests', () => {
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

  // it('Should be able to navigate to Crowd', done => {
  //   router.navigate(['Crowd']).then(() => {
  //     expect(location.path()).toBe('/crowd');
  //     done();
  //   }).catch(e => done.fail(e));
  // });

});
