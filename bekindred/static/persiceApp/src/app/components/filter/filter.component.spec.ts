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


import {BaseRequestOptions, ConnectionBackend, Http, MockBackend, Response,
ResponseOptions, RequestMethods, HTTP_BINDINGS
} from 'angular2/http';

import {DOM} from 'angular2/src/core/dom/dom_adapter';


import {Component, View, provide} from 'angular2/angular2';
import {FilterComponent} from './filter.component';
import {FilterService} from '../../services/filter.service';

// Create a test component to test directives
@Component({
  template: '',
  directives: [FilterComponent]
})
class TestComponent {
}

describe('Filter component', () => {

  beforeEachProviders(() => [
    FilterService,
    BaseRequestOptions,
    MockBackend,
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
  ]);


  it('should exist', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.overrideTemplate(TestComponent, '<div><filters></filters><div>')
      .createAsync(TestComponent).then((fixture: any) => {

        let componentInstance = fixture.debugElement.componentViewChildren[0].componentInstance;
        let componentDOMEl = fixture.debugElement.nativeElement;
        let elRef = fixture.debugElement.elementRef;

        expect(elRef).not.toBeNull(true);

      });
  }));

  it('should have gender', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.overrideTemplate(TestComponent, '<div><filters></filters><div>')
      .createAsync(TestComponent).then((fixture: any) => {

        let componentInstance = fixture.debugElement.componentViewChildren[0].componentInstance;
        let componentDOMEl = fixture.debugElement.nativeElement;
        let elRef = fixture.debugElement.elementRef;


        let headers = DOM.querySelectorAll(componentDOMEl, 'h3.filter__item__title');
        expect(headers[0].textContent.trim()).toEqual('Gender');

      });
  }));

  it('should have age', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.overrideTemplate(TestComponent, '<div><filters></filters><div>')
      .createAsync(TestComponent).then((fixture: any) => {

        let componentInstance = fixture.debugElement.componentViewChildren[0].componentInstance;
        let componentDOMEl = fixture.debugElement.nativeElement;
        let elRef = fixture.debugElement.elementRef;

        let headers = DOM.querySelectorAll(componentDOMEl, 'h3.filter__item__title');
        expect(headers[1].textContent.trim()).toEqual('Age');

      });
  }));

  it('should have distance', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.overrideTemplate(TestComponent, '<div><filters></filters><div>')
      .createAsync(TestComponent).then((fixture: any) => {

        let componentInstance = fixture.debugElement.componentViewChildren[0].componentInstance;
        let componentDOMEl = fixture.debugElement.nativeElement;
        let elRef = fixture.debugElement.elementRef;

        let headers = DOM.querySelectorAll(componentDOMEl, 'h3.filter__item__title');
        expect(headers[2].textContent.trim()).toEqual('Distance');

      });
  }));


  it('should have order by', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.overrideTemplate(TestComponent, '<div><filters></filters><div>')
      .createAsync(TestComponent).then((fixture: any) => {

        let componentInstance = fixture.debugElement.componentViewChildren[0].componentInstance;
        let componentDOMEl = fixture.debugElement.nativeElement;
        let elRef = fixture.debugElement.elementRef;

        let headers = DOM.querySelectorAll(componentDOMEl, 'h3.filter__item__title');
        expect(headers[3].textContent.trim()).toEqual('Order by');

      });
  }));


});
