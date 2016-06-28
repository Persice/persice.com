// TODO(sasa): fix unit tests once @angular/router has testing exported

import {expect, it, async, xdescribe, inject, beforeEach, beforeEachProviders}
from '@angular/core/testing';
import {provide, Provider} from '@angular/core';
import {BaseRequestOptions, Http} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import {Observable} from 'rxjs';
import {MockRouterProvider} from '../../../common/test/mocks/routes';

import {InterestsService} from '../../../app/shared/services/interests.service';
import {GoalsService} from '../../../app/shared/services/goals.service';
import {OffersService} from '../../../app/shared/services/offers.service';
import {PhotosService} from '../../../app/shared/services/photos.service';
import {AppStateService} from '../../shared/services/app-state.service';
import {HttpClient} from '../../../app/shared/core';

import {TestComponentBuilder} from '@angular/compiler/testing';
import {EditMyProfileNavigationComponent} from './edit-my-profile-navigation.component';

class MockInterestsService extends InterestsService {
  fakeResponse: any = null;

  public getCount(): Observable<any> {
    return Observable.of(this.fakeResponse);
  }

  public setResponse(response: any): void {
    this.fakeResponse = response;
  }

  public getProvider(): Provider {
    return provide(InterestsService, { useValue: this });
  }

}

class MockPhotosService extends PhotosService {
  fakeResponse: any = null;

  public getCount(): Observable<any> {
    return Observable.of(this.fakeResponse);
  }

  public setResponse(response: any): void {
    this.fakeResponse = response;
  }

  public getProvider(): Provider {
    return provide(PhotosService, { useValue: this });
  }

}

class MockOffersService extends OffersService {
  fakeResponse: any = null;

  public getCount(): Observable<any> {
    return Observable.of(this.fakeResponse);
  }

  public setResponse(response: any): void {
    this.fakeResponse = response;
  }

  public getProvider(): Provider {
    return provide(OffersService, { useValue: this });
  }

}

class MockGoalsService extends GoalsService {
  fakeResponse: any = null;

  public getCount(): Observable<any> {
    return Observable.of(this.fakeResponse);
  }

  public setResponse(response: any): void {
    this.fakeResponse = response;
  }

  public getProvider(): Provider {
    return provide(GoalsService, { useValue: this });
  }

}

let component: EditMyProfileNavigationComponent;
let domElement: any;

xdescribe('My profile edit navigation mobile component', () => {
  var mockRouterProvider: MockRouterProvider;
  let mockInterestsService: MockInterestsService;
  let mockOffersService: MockOffersService;
  let mockPhotosService: MockPhotosService;
  let mockGoalsService: MockGoalsService;

  beforeEachProviders(() => {
    mockRouterProvider = new MockRouterProvider();
    mockInterestsService = new MockInterestsService(null);
    mockOffersService = new MockOffersService(null);
    mockGoalsService = new MockGoalsService(null);
    mockPhotosService = new MockPhotosService(null);

    return [
      AppStateService,
      HttpClient,
      MockBackend,
      BaseRequestOptions,
      HttpClient,
      provide(Http, {
        useFactory: (backend, options) => new Http(backend, options),
        deps: [MockBackend, BaseRequestOptions]
      }),
      mockRouterProvider.getProviders(),
      mockInterestsService.getProvider(),
      mockGoalsService.getProvider(),
      mockOffersService.getProvider(),
      mockPhotosService.getProvider()
    ];
  });

  beforeEach(async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    return tcb
      .overrideProviders(
      EditMyProfileNavigationComponent, [
        provide(InterestsService, { useValue: mockInterestsService }),
        provide(OffersService, { useValue: mockOffersService }),
        provide(GoalsService, { useValue: mockGoalsService }),
        provide(PhotosService, { useValue: mockPhotosService })
      ])
      .createAsync(EditMyProfileNavigationComponent)
      .then((componentFixture: any) => {
        this.componentFixture = componentFixture;
        component = componentFixture.componentInstance;
        domElement = componentFixture.nativeElement;
      });
  })));

  it('should render', () => {
    this.componentFixture.detectChanges();
    expect(domElement).not.toBeNull();
  });

  it('should have links', () => {
    this.componentFixture.detectChanges();

    var links = [
      'edit-profile', 'interests'];
    for (var link in links) {
      expect(domElement.querySelectorAll(`a[href='/${link}']`)).not.toBeNull();
    }
  });

  it('should have titles', () => {
    // given
    var titles = ['personal info', 'photos', 'interests', 'goals', 'offers', 'social accounts'];

    // when
    this.componentFixture.detectChanges();

    // then
    for (var i = titles.length - 1; i >= 0; i--) {
      let selector = '.profile-titleline__' + i;
      let expectedTitle = capitalizeFirstLetter(titles[i]);
      expect(domElement.querySelectorAll(`${selector}`)[0].innerText).toBe(expectedTitle);
    }

  });


  it('should display counter for photos', () => {
    // given
    let dboCounter = 5;
    serviceReturnsCounter(mockPhotosService, dboCounter);

    // when
    this.componentFixture.detectChanges();

    // then
    const photosCounter = obtainInnerHtml(domElement, '#photos-counter');
    const expectedCounter = `(${dboCounter})`;
    expect(photosCounter).toBe(expectedCounter);
  });

  it('should display counter for goals', () => {
    // given
    let dboCounter = 5;
    serviceReturnsCounter(mockGoalsService, dboCounter);

    // when
    this.componentFixture.detectChanges();

    // then
    const goalsCounter = obtainInnerHtml(domElement, '#goals-counter');
    const expectedCounter = `(${dboCounter})`;
    expect(goalsCounter).toBe(expectedCounter);
  });

  it('should display counter for offers', () => {
    // given
    let dboCounter = 5;
    serviceReturnsCounter(mockOffersService, dboCounter);

    // when
    this.componentFixture.detectChanges();

    // then
    const offersCounter = obtainInnerHtml(domElement, '#offers-counter');
    const expectedCounter = `(${dboCounter})`;
    expect(offersCounter).toBe(expectedCounter);
  });

  it('should display counter for interests', () => {
    // given
    let dboCounter = 5;
    serviceReturnsCounter(mockInterestsService, dboCounter);

    // when
    this.componentFixture.detectChanges();

    // then
    const interestsCounter = obtainInnerHtml(domElement, '#interests-counter');
    const expectedCounter = `(${dboCounter})`;
    expect(interestsCounter).toBe(expectedCounter);
  });

  function obtainInnerHtml(element, selector) {
    return element.querySelector(selector).innerText;
  }

  function serviceReturnsCounter(service, counter) {
    service.setResponse(counter);
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

});
