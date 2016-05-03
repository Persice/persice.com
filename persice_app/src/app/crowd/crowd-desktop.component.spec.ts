import {
  expect,
  it,
  describe,
  inject,
  async,
  beforeEachProviders
} from '@angular/core/testing';
import {TestComponentBuilder} from '@angular/compiler/testing';

import {Component, provide} from '@angular/core';
import {BaseRequestOptions, ConnectionBackend, Http} from '@angular/http';
import {MockBackend} from '@angular/http/testing';

import {FriendService} from '../shared/services';
import {FilterService} from '../shared/services';
import {CrowdComponentDesktop} from "./crowd-desktop.component";
import {CrowdService} from "../../common/crowd/crowd.service";

// Create a test component to test directives.
@Component({
  template: '',
  directives: [CrowdComponentDesktop]
})
class TestComponent { }
class MockFilterService extends FilterService { }
class MockFriendService extends FriendService { }
class MockCrowdService extends CrowdService { }

describe('Crowd mobile component', () => {

  beforeEachProviders(() => [
    provide(FilterService, { useClass: MockFilterService }),
    provide(CrowdService, { useClass: MockCrowdService }),
    provide(FriendService, { useClass: MockFriendService }),
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

  it('should exist', async(inject(
    [TestComponentBuilder], (tcb) => {
      return tcb.overrideTemplate(TestComponent, '<div><div>')
        .createAsync(TestComponent).then((fixture) => {
          fixture.detectChanges();
          let componentDOMEl = fixture.debugElement.nativeElement;
          let elRef = fixture.debugElement.elementRef;
          expect(elRef).not.toBeNull(true);
        });
    })));
});
