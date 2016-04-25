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


function obtainLength(element, selector) {
  return element.querySelectorAll(selector).length;
}

describe('Crowd mobile component', () => {
  let componentFixture: ComponentFixture,
    mockCrowdService: MockCrowdService;
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
      .overrideProviders(CrowdComponentMobile, [provide(CrowdService, { useValue: mockCrowdService })])
      .createAsync(TestComponent)
      .then((componentFixture: ComponentFixture) => {
        this.componentFixture = componentFixture;
      });
  }));

  it('should show crowd list when matchfeed returns results', () => {
    mockCrowdService.setResponse(MockCrowd);
    let componentInstance = this.componentFixture.componentInstance,
      element = this.componentFixture.nativeElement;

    this.componentFixture.detectChanges();

    const crowdLength = obtainLength(element, '.user-card');
    expect(crowdLength).toBeGreaterThan(0);
  });

  it('should be empty when matchfeed returns zero results', () => {
    mockCrowdService.setResponse(MockCrowdEmpty);
    let componentInstance = this.componentFixture.componentInstance,
      element = this.componentFixture.nativeElement;

    this.componentFixture.detectChanges();

    const crowdLength = obtainLength(element, '.user-card');
    expect(crowdLength).toEqual(0);
  });

});
