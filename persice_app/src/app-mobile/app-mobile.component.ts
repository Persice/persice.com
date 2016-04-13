import {
  Component,
  ViewEncapsulation
} from 'angular2/core';

import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';

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
import {CrowdMobileComponent} from './crowd';
import {ConnectionsMobileComponent} from './connections';
import {SettingsMobileComponent} from './settings';
import {EventsMobileComponent} from './events';
import {MessagesMobileComponent} from './messages';
import {MyProfileMobileComponent} from './my-profile';


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
export class AppMobileComponent {



}
