/// <reference path="../../../typings/_custom.d.ts" />

import {
iit,
it,
ddescribe,
describe,
expect,
inject,
injectAsync,
TestComponentBuilder,
beforeEachProviders,
fakeAsync,
tick
} from 'angular2/testing';

import {Component, View, provide, DirectiveResolver} from 'angular2/angular2';
import {Location, Router, RouteRegistry, RouterLink} from 'angular2/router';
import {SpyLocation} from 'angular2/src/mock/location_mock';
import {RootRouter} from 'angular2/src/router/router';
import {DOM} from 'angular2/src/core/dom/dom_adapter';

import {SubnavComponent} from './subnav.component';
import {AppComponent} from '../app.component';

// Create a test component to test directives
@Component({
  template: '',
  directives: [SubnavComponent]
})
class TestComponent {
}

describe('NavMain component', () => {

  beforeEachProviders(() => [
    RouterLink,
    RouteRegistry,
    DirectiveResolver,
    provide(Location, { useClass: SpyLocation }),
    provide(Router,
      {
        useFactory:
        (registry, location) => { return new RootRouter(registry, location, AppComponent); },
        deps: [RouteRegistry, Location]
      })

  ]);


  it('should exist', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.overrideTemplate(TestComponent, '<div><subnav></subnav></div>')
      .createAsync(TestComponent).then((fixture: any) => {

        let componentInstance = fixture.debugElement.componentViewChildren[0].componentInstance;
        let componentDOMEl = fixture.debugElement.nativeElement;
        let elRef = fixture.debugElement.elementRef;

        expect(elRef).not.toBeNull(true);


      });
  }));


  it('should have links', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.overrideTemplate(TestComponent, '<div><subnav></subnav></div>')
      .createAsync(TestComponent).then((fixture: any) => {

        let componentInstance = fixture.debugElement.componentViewChildren[0].componentInstance;
        let componentDOMEl = fixture.debugElement.nativeElement;
        let elRef = fixture.debugElement.elementRef;


        let links = DOM.querySelectorAll(componentDOMEl, 'a.sub-nav__link');

        expect(links.length).toEqual(3);
        expect(links[0].textContent.trim()).toEqual('All events');
        expect(links[1].textContent.trim()).toEqual('My events');
        expect(links[2].textContent.trim()).toEqual('My network');
      });
  }));

});
