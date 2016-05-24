import {expect, it, async, describe, inject, beforeEach, beforeEachProviders}
from '@angular/core/testing';
import {provide, Provider} from '@angular/core';
import {BaseRequestOptions, Http} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import {Observable} from 'rxjs';
import {MockRouterProvider} from '../../../common/test/mocks/routes';

import {EditPhotosMobileComponent} from './edit-photos-mobile.component';
import {PhotosService} from '../../../app/shared/services';
import {AppStateService} from '../../shared/services/app-state.service';
import {HttpClient} from '../../../app/shared/core';
import {TestComponentBuilder} from '@angular/compiler/testing';

class MockPhotosService extends PhotosService {
  fakeResponse: any = null;

  public getMyPhotos(): Observable<any> {
    return Observable.of(this.fakeResponse);
  }

  public setResponse(response: any): void {
    this.fakeResponse = response;
  }

  public getProvider(): Provider {
    return provide(PhotosService, { useValue: this });
  }

}


let component: EditPhotosMobileComponent;
let domElement: any;

describe('Edit photos mobile component', () => {
  var mockRouterProvider: MockRouterProvider;
  let mockPhotosService: MockPhotosService;

  beforeEachProviders(() => {
    mockRouterProvider = new MockRouterProvider();
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
      mockPhotosService.getProvider()
    ];
  });

  beforeEach(async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    return tcb
      .overrideProviders(
      EditPhotosMobileComponent, [
        provide(PhotosService, { useValue: mockPhotosService })
      ])
      .createAsync(EditPhotosMobileComponent)
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


  // it('should display photos', () => {
  //   // given
  //   let dboCounter = 5;
  //   serviceReturnsCounter(mockInterestsService, dboCounter);

  //   // when
  //   this.componentFixture.detectChanges();

  //   // then
  //   const interestsCounter = obtainInnerHtml(domElement, '#interests-counter');
  //   const expectedCounter = `(${dboCounter})`;
  //   expect(interestsCounter).toBe(expectedCounter);
  // });

  // function obtainInnerHtml(element, selector) {
  //   return element.querySelector(selector).innerText;
  // }

  function serviceReturnsPhotos(service, photos) {
    service.setResponse(photos);
  }

});
