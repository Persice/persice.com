import {
  expect,
  it,
  xdescribe,
  beforeEach,
  inject,
  async,
  beforeEachProviders
} from '@angular/core/testing';
import {TestComponentBuilder, ComponentFixture} from '@angular/compiler/testing';

import {Component, provide} from '@angular/core';
import {BaseRequestOptions, Http} from '@angular/http';
import {MockBackend} from '@angular/http/testing';

import {FriendService} from '../shared/services';
import {FilterService} from '../shared/services';
import {CrowdDesktopComponent} from './crowd-desktop.component';
import {CrowdService} from '../../common/crowd/crowd.service';
import {MockCrowd, MockCrowdEmpty} from "../../common/crowd/crowd.mock";
import {MockCrowdService} from "../../common/crowd/crowd.service.mock";
import {HttpClient} from "../shared/core/http-client";

// Create a test component to test directives.
@Component({
  template: '<prs-crowd></prs-crowd>',
  directives: [CrowdDesktopComponent],
  providers: [
    FilterService
  ]
})
class TestComponent { }

let componentInstance: TestComponent;
let componentElement: any;

xdescribe('Crowd desktop component', () => {
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

  beforeEach(async(inject([TestComponentBuilder], (tcb) => {
    return tcb
      .overrideProviders(
        CrowdDesktopComponent, [provide(CrowdService, { useValue: mockCrowdService })])
      .createAsync(TestComponent)
      .then((componentFixture: ComponentFixture<any>) => {
        this.componentFixture = componentFixture;
        componentInstance = componentFixture.componentInstance;
        componentElement = componentFixture.nativeElement;
      });
  })));

  it('should show crowd list when matchfeed returns results', () => {
    // given
    crowdServiceReturnsResults();

    // when
    this.componentFixture.detectChanges();

    // then
    const crowdLength = obtainLength(componentElement, '.card--user');
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
