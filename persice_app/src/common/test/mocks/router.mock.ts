import {ComponentResolver, Injector} from '@angular/core';
import {tick} from '@angular/core/testing';
import {SpyLocation} from '@angular/common/testing';
import {ComponentFixture} from '@angular/compiler/testing';
import {Location, LocationStrategy} from '@angular/common';
import {MockLocationStrategy} from '@angular/common/testing/mock_location_strategy';
import {Router, RouterConfig, RouterOutletMap, UrlSerializer,
  DefaultUrlSerializer, ActivatedRoute} from '@angular/router';

import {AppMobileComponent, routesAppMobile} from '../../../app-mobile';

const routes: RouterConfig = routesAppMobile;

export const TEST_ROUTER_PROVIDERS_APP_MOBILE: any[] = [
  RouterOutletMap,
  { provide: UrlSerializer, useClass: DefaultUrlSerializer },
  { provide: Location, useClass: SpyLocation },
  { provide: LocationStrategy, useClass: MockLocationStrategy },
  {
    provide: Router,
    useFactory: (resolver: ComponentResolver, urlSerializer: UrlSerializer,
      outletMap: RouterOutletMap, location: Location, injector: Injector, config: RouterConfig) => {

      const r = new Router(<any>AppMobileComponent, resolver, urlSerializer, outletMap, location, injector, routes);
      r.initialNavigation();
      return r;
    },
    deps: [ComponentResolver, UrlSerializer, RouterOutletMap, Location, Injector]
  },
  { provide: ActivatedRoute, useFactory: (r: Router) => r.routerState.root, deps: [Router] },

];

export function advance(fixture: ComponentFixture<any>): void {
  tick();
  fixture.detectChanges();
}
