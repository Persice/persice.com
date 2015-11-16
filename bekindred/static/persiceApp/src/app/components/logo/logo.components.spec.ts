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

import {LogoComponent} from './logo.component';

import {AppComponent} from '../app.component';

// Create a test component to test directives
@Component({
  template: '',
  directives: [LogoComponent]
})
class TestComponent {
}

describe('Logo component', () => {

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
    return tcb.overrideTemplate(TestComponent, '<logo></logo>')
      .createAsync(TestComponent).then((fixture: any) => {

        let componentInstance = fixture.debugElement.componentViewChildren[0].componentInstance;
        let componentDOMEl = fixture.debugElement.nativeElement;
        let elRef = fixture.debugElement.elementRef;

        expect(elRef).not.toBeNull(true);


      });
  }));

  it('should display logo', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.overrideTemplate(TestComponent, '<logo></logo>')
      .createAsync(TestComponent).then((fixture: any) => {

        let componentInstance = fixture.debugElement.componentViewChildren[0].componentInstance;
        let componentDOMEl = fixture.debugElement.nativeElement;
        let elRef = fixture.debugElement.elementRef;

        let logo = '/static/persiceApp/src/public/images/logo.svg';

        let logoEl = DOM.querySelectorAll(componentDOMEl, '.site-logo__mark')[0];
        let image = DOM.getAttribute(logoEl, 'src');

        expect(image).toEqual(logo);


      });
  }));


  it('should display Persice title', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.overrideTemplate(TestComponent, '<logo></logo>')
      .createAsync(TestComponent).then((fixture: any) => {

        let componentInstance = fixture.debugElement.componentViewChildren[0].componentInstance;
        let componentDOMEl = fixture.debugElement.nativeElement;
        let elRef = fixture.debugElement.elementRef;


        let title = DOM.querySelectorAll(componentDOMEl, 'h1.site-logo__type')[0].textContent;

        expect(title).toEqual('Persice');


      });
  }));

});
