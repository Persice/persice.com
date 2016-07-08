import {inject, fakeAsync, addProviders, TestComponentBuilder} from '@angular/core/testing';
import {ApplicationRef, NgZone, ComponentFactory, Injector, ComponentRef, Type} from '@angular/core';
import {Router} from '@angular/router';
import {Http, ConnectionBackend, BaseRequestOptions} from '@angular/http';
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

 // TODO: remove temporary fix for running unit test with ApplicationRef
 // after router fixes bug with location.back() (OnInit and change detection not fired inside component
 // after)
class MockApplicationRef {
  registerBootstrapListener(listener: (ref: ComponentRef<any>) => void): void { }

  registerDisposeListener(dispose: () => void): void { }

  bootstrap<C>(componentFactory: ComponentFactory<C>): ComponentRef<C> { return null; }

  get injector(): Injector { return null; };

  get zone(): NgZone { return null; };

  run(callback: Function): any { return null; }

  waitForAsyncInitializers(): Promise<any> { return null; }

  dispose(): void { }

  tick(): void { }

  get componentTypes(): Type[] { return null; };
}

describe('App component mobile', () => {

  let mockGeolocationService;

  beforeEach(() => {
    mockGeolocationService = new MockGeolocationService();

    addProviders([
      { provide: ApplicationRef, useClass: MockApplicationRef },
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

  xit('should navigate to Crowd page',
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

  xit('should navigate to Connections page',
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

  xit('should navigate to Mesages page',
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

  xit('should navigate to Events page',
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
        expect(location.path()).toEqual('/events/all');
      })));

  xit('should navigate to Settings page',
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

  xit('should navigate to Privacy page',
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

  xit('should navigate to Terms page',
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

  xit('should navigate to My profile page',
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
