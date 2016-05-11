import {expect, it, describe, inject, beforeEach, beforeEachProviders}
  from '@angular/core/testing';
import {
  ROUTER_PRIMARY_COMPONENT,
  Router,
  RouteRegistry
} from '@angular/router-deprecated';
import {provide} from '@angular/core';
import {SpyLocation} from '@angular/common/testing';
import {RootRouter} from '@angular/router-deprecated/src/router';
import {Location} from '@angular/common';

import {TestComponentBuilder} from '@angular/compiler/testing';
import {NavigationMobileComponent} from "./navigation-mobile.component";
import {AppMobileComponent} from "../app-mobile.component";

let component: NavigationMobileComponent;
let domElement: any;

describe('Navigation mobile component', () => {

  beforeEachProviders(() => [
    RouteRegistry,
    provide(Location, {useClass: SpyLocation}),
    provide(Router, {useClass: RootRouter}),
    provide(ROUTER_PRIMARY_COMPONENT, {useValue: AppMobileComponent})
  ]);

  beforeEach(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    return tcb
      .overrideProviders(
        NavigationMobileComponent, [])
      .createAsync(NavigationMobileComponent)
      .then((componentFixture: any) => {
        this.componentFixture = componentFixture;
        component = componentFixture.componentInstance;
        domElement = componentFixture.nativeElement;
      });
  }));

  it('should render', () => {
    expect(domElement).not.toBeNull();
  });

  it('should have links in sidebar', () => {
    this.componentFixture.detectChanges();

    var sidebarLinks = [
      'my-profile', 'crowd', 'messages', 'connections', 'events', 'settings', 'logout'];
    for (var link in sidebarLinks) {
      expect(domElement.querySelectorAll(`a[href="/${link}"]`)).not.toBeNull();
    }
  });
});
