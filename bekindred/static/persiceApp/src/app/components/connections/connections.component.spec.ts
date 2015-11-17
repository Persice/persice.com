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

import {Component, View, provide, CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/angular2';
import {Location} from 'angular2/router';
import {BaseRequestOptions, ConnectionBackend, Http, MockBackend, Response,
ResponseOptions, RequestMethods, HTTP_BINDINGS
} from 'angular2/http';


import {ConnectionsComponent} from './connections.component';
import {ConnectionsService} from '../../services/connections.service';
import {FilterService} from '../../services/filter.service';

// Create a test component to test directives
@Component({
  template: '',
  viewBindings: [HTTP_BINDINGS],
  directives: [ConnectionsComponent, CORE_DIRECTIVES, FORM_DIRECTIVES]
})
class TestComponent {
}

describe('Connections component', () => {

  beforeEachProviders(() => [
    ConnectionsService,
    FilterService,
    Location,
    BaseRequestOptions,
    CORE_DIRECTIVES,
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
    return tcb.overrideTemplate(TestComponent, '<div><connections-page></connections-page><div>')
      .createAsync(TestComponent).then((fixture: any) => {

        fixture.detectChanges();
        let componentInstance = fixture.debugElement.componentViewChildren[0].componentInstance;
        let componentDOMEl = fixture.debugElement.nativeElement;
        let elRef = fixture.debugElement.elementRef;

        expect(elRef).not.toBeNull(true);


      });
  }));

});
