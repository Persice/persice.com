import {inject, fakeAsync, addProviders} from '@angular/core/testing';
import {Router} from '@angular/router';
import {Http, ConnectionBackend, BaseRequestOptions} from '@angular/http';
import {TestComponentBuilder} from '@angular/compiler/testing';
import {Location} from '@angular/common';
import {MockBackend} from '@angular/http/testing';
import {provideTestRouter, advance, createRoot} from '../common/test/app-mobile-test.helpers';
import {AppMobileComponent} from './app-mobile.component';
import {provideStore} from '@ngrx/store';
import STORE_REDUCERS from '../common/reducers';
import STORE_ACTIONS from '../common/actions';
import {HttpClient} from '../app/shared/core/http-client';
import {WebsocketService} from '../app/shared/services';
import {AppStateService} from './shared/services';
import {MockGeolocationService} from '../app/shared/services/mock-geolocation.service';
import {UnreadMessagesCounterService, NewConnectionsCounterService} from '../common/services';
import {routesAppMobile} from './app-mobile.routes';

describe('App component mobile', () => {

  var mockGeolocationService;

  beforeEach(() => {
    mockGeolocationService = new MockGeolocationService();

    addProviders([
      provideTestRouter(AppMobileComponent, routesAppMobile),
      AppStateService,
      UnreadMessagesCounterService,
      NewConnectionsCounterService,
      WebsocketService,
      provideStore(STORE_REDUCERS),
      STORE_ACTIONS,
      BaseRequestOptions,
      MockBackend,
      HttpClient,
      {
        provide: Http,
        useFactory: (connectionBackend: ConnectionBackend,
                     defaultOptions: BaseRequestOptions) => {
          return new Http(connectionBackend, defaultOptions);
        },
        deps: [
          MockBackend,
          BaseRequestOptions
        ]
      },
      mockGeolocationService.getProviders()
    ]);
  });

  it('should navigate to Crowd page',
    fakeAsync(inject(
      [Router, TestComponentBuilder, Location],
      (router: Router, tcb: TestComponentBuilder, location: Location) => {
        // given
        const fixture = createRoot(tcb, router, AppMobileComponent);

        // when
        router.navigateByUrl('/crowd');
        advance(fixture);

        // then
        expect(location.path()).toEqual('/crowd');
      })));

  it('should navigate to Connections page',
    fakeAsync(inject(
      [Router, TestComponentBuilder, Location],
      (router: Router, tcb: TestComponentBuilder, location: Location) => {
        // given
        const fixture = tcb.createFakeAsync(<any>AppMobileComponent);
        advance(fixture);

        // when
        router.navigateByUrl('/connections');
        advance(fixture);

        // then
        expect(location.path()).toEqual('/connections');
      })));

  it('should navigate to Mesages page',
    fakeAsync(inject(
      [Router, TestComponentBuilder, Location],
      (router: Router, tcb: TestComponentBuilder, location: Location) => {
        // given
        const fixture = tcb.createFakeAsync(<any>AppMobileComponent);
        advance(fixture);

        // when
        router.navigateByUrl('/messages');
        advance(fixture);

        // then
        expect(location.path()).toEqual('/messages');
      })));

  it('should navigate to Events page',
    fakeAsync(inject(
      [Router, TestComponentBuilder, Location],
      (router: Router, tcb: TestComponentBuilder, location: Location) => {
        // given
        const fixture = tcb.createFakeAsync(<any>AppMobileComponent);
        advance(fixture);

        // when
        router.navigateByUrl('/events');
        advance(fixture);

        // then
        expect(location.path()).toEqual('/events');
      })));

  it('should navigate to Settings page',
    fakeAsync(inject(
      [Router, TestComponentBuilder, Location],
      (router: Router, tcb: TestComponentBuilder, location: Location) => {
        // given
        const fixture = tcb.createFakeAsync(<any>AppMobileComponent);
        advance(fixture);

        // when
        router.navigateByUrl('/settings');
        advance(fixture);

        // then
        expect(location.path()).toEqual('/settings');
      })));

  it('should navigate to Privacy page',
    fakeAsync(inject(
      [Router, TestComponentBuilder, Location],
      (router: Router, tcb: TestComponentBuilder, location: Location) => {
        // given
        const fixture = tcb.createFakeAsync(<any>AppMobileComponent);
        advance(fixture);

        // when
        router.navigateByUrl('/privacy');
        advance(fixture);

        // then
        expect(location.path()).toEqual('/privacy');
      })));

  it('should navigate to Terms page',
    fakeAsync(inject(
      [Router, TestComponentBuilder, Location],
      (router: Router, tcb: TestComponentBuilder, location: Location) => {
        // given
        const fixture = tcb.createFakeAsync(<any>AppMobileComponent);
        advance(fixture);

        // when
        router.navigateByUrl('/terms');
        advance(fixture);

        // then
        expect(location.path()).toEqual('/terms');
      })));

  it('should navigate to My profile page',
    fakeAsync(inject(
      [Router, TestComponentBuilder, Location],
      (router: Router, tcb: TestComponentBuilder, location: Location) => {
        // given
        const fixture = tcb.createFakeAsync(<any>AppMobileComponent);
        advance(fixture);

        // when
        router.navigateByUrl('/johndoe');
        advance(fixture);

        // then
        expect(location.path()).toEqual('/johndoe');
      })));

  // TODO(sasa): needs recatoring
  xit('should ask browser for geolocation',
    fakeAsync(inject(
      [TestComponentBuilder],
      (tcb: TestComponentBuilder) => {
        // given
        const fixture = tcb.createFakeAsync(<any>AppMobileComponent);
        advance(fixture);

        // when
        fixture.componentInstance.ngOnInit();
        advance(fixture);

        // then
        expect(mockGeolocationService.getLocationSpy).toHaveBeenCalled();
      })));

});
