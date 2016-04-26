import {
  expect,
  it,
  describe,
  injectAsync,
  TestComponentBuilder,
  beforeEachProviders,
  beforeEach,
  inject,
  fakeAsync,
  tick,
  ComponentFixture
} from 'angular2/testing';

import {Component, provide} from 'angular2/core';
import {BaseRequestOptions, ConnectionBackend, Http} from 'angular2/http';
import {MockBackend} from 'angular2/http/testing';

import {
  MockCrowd,
  MockCrowdEmpty,
  MockCrowdService,
  CrowdService
} from '../../common/crowd';

import {CrowdComponentMobile} from './crowd-mobile.component';
import {FilterService, FriendService} from '../../app/shared/services';
import {HttpClient} from '../../app/shared/core/http-client';


@Component({
  template: `<prs-mobile-crowd></prs-mobile-crowd>`,
  directives: [CrowdComponentMobile],
  providers: [
    FilterService
  ]
})
class TestComponent { }

let componentInstance: TestComponent;
let componentElement: any;

describe('Crowd mobile component', () => {
  let mockCrowdService: MockCrowdService;

  beforeEachProviders(() => {
    mockCrowdService = new MockCrowdService(null);
    return [
      mockCrowdService.getProvider(),
      FilterService,
      FriendService,
      MockBackend,
      BaseRequestOptions,
      HttpClient,
      provide(Http, {
        useFactory: (backend, options) => new Http(backend, options),
        deps: [MockBackend, BaseRequestOptions]
      })
    ];
  });

  beforeEach(injectAsync([TestComponentBuilder], (tcb) => {
    return tcb
      .overrideProviders(
        CrowdComponentMobile, [provide(CrowdService, { useValue: mockCrowdService })])
      .createAsync(TestComponent)
      .then((componentFixture: ComponentFixture) => {
        this.componentFixture = componentFixture;
        componentInstance = componentFixture.componentInstance;
        componentElement = componentFixture.nativeElement;
      });
  }));

  it('should show crowd list when matchfeed returns results', () => {
    // given
    crowdServiceReturnsResults();

    // when
    this.componentFixture.detectChanges();

    // then
    const crowdLength = obtainLength(componentElement, '.user-card');
    expect(crowdLength).toBeGreaterThan(0);
  });

  it('should be empty when matchfeed returns zero results', () => {
    // given
    crowdServiceReturnsNoResults();

    // when
    this.componentFixture.detectChanges();

    // then
    const crowdLength = obtainLength(componentElement, '.user-card');
    expect(crowdLength).toEqual(0);
  });

  function crowdServiceReturnsResults() {
    mockCrowdService.setResponse(MockCrowd);
  }

  function crowdServiceReturnsNoResults() {
    mockCrowdService.setResponse(MockCrowdEmpty);
  }

  function obtainLength(element, selector) {
    return element.querySelectorAll(selector).length;
  }

});
