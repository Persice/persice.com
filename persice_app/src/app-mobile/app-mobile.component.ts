import {
  Component,
  ViewEncapsulation,
  OnInit
} from 'angular2/core';

import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {BrowserDomAdapter} from 'angular2/platform/browser';

import {
  RouteConfig,
  ROUTER_DIRECTIVES,
  RouteRegistry,
  AsyncRoute,
  Router
} from 'angular2/router';

import {
  OpenLeftMenuDirective,
  CloseLeftMenuDirective,
  IfRoutesActiveDirective
} from './shared/directives';
import {NavigationMobileComponent} from './navigation';
import {CrowdComponentMobile} from "./crowd";
import {PageTitleComponent} from './page-title';
import {FilterService} from '../app/shared/services';

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
    component: CrowdComponentMobile,
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
    FilterService
  ],
  directives: [
    CORE_DIRECTIVES,
    FORM_DIRECTIVES,
    ROUTER_DIRECTIVES,
    NavigationMobileComponent,
    OpenLeftMenuDirective,
    CloseLeftMenuDirective,
    IfRoutesActiveDirective,
    PageTitleComponent
  ],
  encapsulation: ViewEncapsulation.None
})
export class AppMobileComponent implements OnInit {
  isHeaderHidden: boolean = false;
  pagesWithFilter = ['crowd'];
  pageTitle = 'Persice';

  constructor(
    private filterService: FilterService,
    private _router: Router
    ) { }

  ngOnInit() {
    this.filterService.isVisibleEmitter
      .subscribe((visibility: boolean) => {
        this.isHeaderHidden = visibility;
      });

    this._router.subscribe((next: string) => {
      this._onRouteChange(next);
    });
  }

  setFilterVisible() {
    this.filterService.setVisibility(true);
  }

  private _onRouteChange(next: string) {
    this.pageTitle = next;
  }

}
