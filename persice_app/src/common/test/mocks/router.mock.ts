import {ComponentResolver, Injector} from '@angular/core';
import {tick} from '@angular/core/testing';
import {SpyLocation} from '@angular/common/testing';
import {ComponentFixture} from '@angular/core/testing';
import {Location, LocationStrategy} from '@angular/common';
import {
  Router,
  RouterConfig,
  RouterOutletMap,
  UrlSerializer,
  DefaultUrlSerializer,
  ActivatedRoute
} from '@angular/router';

export function provideTestRouter(RootCmp: any, config: RouterConfig): any[] {
  return [
    RouterOutletMap,
    {provide: UrlSerializer, useClass: DefaultUrlSerializer},
    {provide: Location, useClass: SpyLocation},
    {provide: LocationStrategy, useClass: SpyLocation},
    {
      provide: Router,
      useFactory: (resolver: ComponentResolver, urlSerializer: UrlSerializer, outletMap: RouterOutletMap, location: Location, injector: Injector) => {
        return new (<any>Router)(
          RootCmp, resolver, urlSerializer, outletMap, location, injector, config);
      },
      deps: [ComponentResolver, UrlSerializer, RouterOutletMap, Location, Injector]
    },
    {provide: ActivatedRoute, useFactory: (r: Router) => r.routerState.root, deps: [Router]},
  ];
};

export function advance(fixture: ComponentFixture<any>): void {
  tick();
  fixture.detectChanges();
}
