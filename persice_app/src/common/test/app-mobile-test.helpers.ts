import {ComponentResolver, Injector, Component} from '@angular/core';
import {tick, TestComponentBuilder, ComponentFixture} from '@angular/core/testing';
import {SpyLocation} from '@angular/common/testing';
import {Location, LocationStrategy} from '@angular/common';
import {
  Router,
  RouterConfig,
  RouterOutletMap,
  UrlSerializer,
  DefaultUrlSerializer,
  ActivatedRoute,
  ROUTER_DIRECTIVES
} from '@angular/router';
import {CrowdMobileComponent} from '../../app-mobile/crowd';
import {NoContentComponent} from '../../app-mobile/no-content';
import {ConnectionsMobileComponent} from '../../app-mobile/connections';
import {SettingsMobileComponent} from '../../app-mobile/settings';
import {EventsMobileComponent} from '../../app-mobile/events';
import {EventMobileComponent} from '../../app-mobile/events/event/event-mobile.component';
import {AttendeesMobileComponent} from '../../app-mobile/events/attendees';
import {UserProfileLoaderComponent} from '../../app-mobile/user-profile-loader';
import {TermsOfServiceMobileComponent} from '../../app-mobile/info/terms-of-service';
import {PrivacyPolicyMobileComponent} from '../../app-mobile/info/privacy-policy';

export function provideTestRouter(RootCmp: any, config: RouterConfig): any[] {
  return [
    RouterOutletMap,
    {provide: UrlSerializer, useClass: DefaultUrlSerializer},
    {provide: Location, useClass: SpyLocation},
    {provide: LocationStrategy, useClass: SpyLocation},
    {
      provide: Router,
      useFactory: (resolver: ComponentResolver, urlSerializer: UrlSerializer, outletMap: RouterOutletMap,
                   location: Location, injector: Injector) => {
        return new (<any>Router)(
          RootCmp, resolver, urlSerializer, outletMap, location, injector, config);
      },
      deps: [ComponentResolver, UrlSerializer, RouterOutletMap, Location, Injector]
    },
    {provide: ActivatedRoute, useFactory: (r: Router) => r.routerState.root, deps: [Router]},
  ];
};

@Component({
  selector: 'blank-cmp',
  template: ``,
  directives: [ROUTER_DIRECTIVES]
})
export class BlankCmp {
}

@Component({
  selector: 'root-cmp',
  template: `<router-outlet></router-outlet>`,
  directives: [ROUTER_DIRECTIVES],
  precompile: [BlankCmp]
})
export class RootCmp {
}

export const routesTestConfigAppMobile: RouterConfig = [
  {path: '', component: BlankCmp},
  {path: 'crowd', component: CrowdMobileComponent},
  {path: 'connections', component: ConnectionsMobileComponent},
  {path: 'settings', component: SettingsMobileComponent},
  {path: 'events', component: EventsMobileComponent},
  {path: 'event/:eventId', component: EventMobileComponent},
  {path: 'attendees/:eventId', component: AttendeesMobileComponent},
  {path: 'privacy', component: PrivacyPolicyMobileComponent},
  {path: 'terms', component: TermsOfServiceMobileComponent},
  {path: ':username', component: UserProfileLoaderComponent},
  {path: '**', component: NoContentComponent}
];

export function advance(fixture: ComponentFixture<any>): void {
  tick();
  fixture.detectChanges();
}

export function createRoot(tcb: TestComponentBuilder, router: Router, type: any): ComponentFixture<any> {
  const f = tcb.createFakeAsync(type);
  advance(f);
  (<any>router).initialNavigation();
  advance(f);
  return f;
}

export function obtainText(element, selector) {
  return element.querySelector(selector).textContent;
}

export function obtainElement(element, selector) {
  return element.querySelector(selector);
}
