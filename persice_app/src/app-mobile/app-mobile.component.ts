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
  Router,
  RouteRegistry,
  AsyncRoute
} from 'angular2/router';

import {
  LeftMenuPushDirective,
  RightMenuPushDirective
} from './shared/directives';
import {NavigationMobileComponent} from './navigation';
import {CrowdComponentMobile} from "./crowd/crowd-mobile.component";

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
    BrowserDomAdapter
  ],
  directives: [
    CORE_DIRECTIVES,
    FORM_DIRECTIVES,
    ROUTER_DIRECTIVES,
    NavigationMobileComponent,
    LeftMenuPushDirective,
    RightMenuPushDirective
  ],
  encapsulation: ViewEncapsulation.None
})
export class AppMobileComponent implements OnInit {

  constructor(
    private _router: Router,
    private _dom: BrowserDomAdapter
  ) {

  }

  ngOnInit() {
    this._router.subscribe((next) => {
      // If route changed, close menus
      if (this._dom.hasClass(this._dom.query('.container'), 'push-menu-push--toright')) {
        this._dom.removeClass(this._dom.query('.container'), 'push-menu-push--toright');
        this._dom.removeClass(this._dom.query('#push-menu-s1'), 'is-open');
      }
      if (this._dom.hasClass(this._dom.query('.container'), 'push-menu-push--toleft')) {
        this._dom.removeClass(this._dom.query('.container'), 'push-menu-push--toleft');
        this._dom.removeClass(this._dom.query('#push-menu-s2'), 'is-open');
      }
    });
  }
}
