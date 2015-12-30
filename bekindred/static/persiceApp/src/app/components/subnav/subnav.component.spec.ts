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

import {Component, View, provide, DirectiveResolver} from 'angular2/core';

import {Router, RootRouter} from 'angular2/src/router/router';
import {SpyLocation} from 'angular2/src/mock/location_mock';
import {Location} from 'angular2/src/router/location';

import {RouteRegistry, ROUTER_PRIMARY_COMPONENT} from 'angular2/src/router/route_registry';
import {RouteConfig, AsyncRoute, Route} from 'angular2/src/router/route_config_decorator';

import {DOM} from 'angular2/src/platform/dom/dom_adapter';

import {SubnavComponent} from './subnav.component';
import {AppComponent} from '../app.component';

// Create a test component to test directives
@Component({
  template: `<span>aaaa</span>`,
  directives: [SubnavComponent]
})
class TestComponent {
}

describe('Subnav component', () => {

  beforeEachProviders(() => [
    RouteRegistry,
    DirectiveResolver,
    provide(Location, { useClass: SpyLocation }),
    provide(ROUTER_PRIMARY_COMPONENT, { useValue: AppComponent }),
    provide(Router, { useClass: RootRouter })

  ]);


  it('should exist', inject([TestComponentBuilder], (tcb) => {
    tcb.overrideTemplate(TestComponent, '<div><subnav></subnav></div>')
      .createAsync(TestComponent).then((fixture: any) => {
        fixture.detectChanges();
        let componentInstance = fixture.componentInstance;
        let componentDOMEl = fixture.debugElement.nativeElement;
        let elRef = fixture.debugElement.elementRef;

        expect(elRef).not.toBeNull(true);
      });
  }));


  it('should have links', inject([TestComponentBuilder], (tcb) => {
    tcb.overrideTemplate(TestComponent, '<div><subnav></subnav></div>')
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
