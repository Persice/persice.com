import {
  Component,
  ViewEncapsulation,
  OnInit
} from '@angular/core';

import {CORE_DIRECTIVES, FORM_DIRECTIVES} from '@angular/common';
import {BrowserDomAdapter} from '@angular/platform-browser/src/browser/browser_adapter';

import {
  RouteConfig,
  ROUTER_DIRECTIVES,
  RouteRegistry,
  AsyncRoute,
  Router
} from '@angular/router-deprecated';

import {
  OpenLeftMenuDirective,
  CloseLeftMenuDirective,
  IfRoutesActiveDirective
} from './shared/directives';
import {NavigationMobileComponent} from './navigation';
import {CrowdMobileComponent} from "./crowd";
import {PageTitleComponent} from './page-title';
import {FilterService} from '../app/shared/services';
import {AppStateService} from './shared/services';
import {ProfileFooterMobileComponent} from './user-profile';


const PAGES_WITH_FILTER: string[] = ['crowd', 'connections'];

/*
 * Persice App Component
 * Top Level Component
 */
@RouteConfig([
  {
    path: '/',
    redirectTo: ['Crowd']
  },
  {
    path: '/crowd',
    component: CrowdMobileComponent,
    name: 'Crowd',
    useAsDefault: true
  },
  new AsyncRoute({
    path: '/connections',
    loader: () => require('es6-promise!./connections')('ConnectionsMobileComponent'),
    name: 'Connections'
  }),
  new AsyncRoute({
    path: '/settings',
    loader: () => require('es6-promise!./settings')('SettingsMobileComponent'),
    name: 'Settings'
  }),
  new AsyncRoute({
    path: '/events',
    loader: () => require('es6-promise!./events')('EventsMobileComponent'),
    name: 'Events'
  }),
  new AsyncRoute({
    path: '/messages',
    loader: () => require('es6-promise!./messages')('MessagesMobileComponent'),
    name: 'Messages'
  }),
  new AsyncRoute({
    path: '/my-profile',
    loader: () => require('es6-promise!./my-profile')('MyProfileMobileComponent'),
    name: 'MyProfile'
  }),
])
@Component({
  selector: 'persice-mobile-app',
  template: require('./app-mobile.html'),
  providers: [
    BrowserDomAdapter,
    FilterService,
    AppStateService
  ],
  directives: [
    CORE_DIRECTIVES,
    FORM_DIRECTIVES,
    ROUTER_DIRECTIVES,
    NavigationMobileComponent,
    OpenLeftMenuDirective,
    CloseLeftMenuDirective,
    IfRoutesActiveDirective,
    PageTitleComponent,
    ProfileFooterMobileComponent
  ],
  encapsulation: ViewEncapsulation.None
})
export class AppMobileComponent implements OnInit {
  isHeaderVisible: boolean = true;
  isFooterVisible: boolean = false;
  pagesWithFilter = PAGES_WITH_FILTER;
  pageTitle = 'Persice';
  footerScore: number = 0;

  constructor(
    private _appStateService: AppStateService,
    private _router: Router
    ) { }

  ngOnInit() {
    // Subscribe to EventEmmitter from AppStateService to show or hide main app header
    this._appStateService.isHeaderVisibleEmitter
      .subscribe((visibility: boolean) => {
        this.isHeaderVisible = visibility;
      });

    this._appStateService.isHeaderVisibleEmitter
      .subscribe((visibility: boolean) => {
        this.isHeaderVisible = visibility;
      });

    this._appStateService.isProfileFooterVisibleEmitter
      .subscribe((state: any) => {
        this.isFooterVisible = state.visibility;
        this.footerScore = state.score;
      });

    this._router.subscribe((next: string) => {
      this._onRouteChange(next);
    });
  }

  setFilterVisible() {
    this._appStateService.setFilterVisibility(true);
    this._appStateService.setHeaderVisibility(false);
  }

  private _onRouteChange(next: string) {
    this.pageTitle = next;
  }

}
