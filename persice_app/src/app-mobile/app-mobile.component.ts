import {Component, ViewEncapsulation, OnInit} from '@angular/core';
import {RouteConfig} from '@angular/router-deprecated';

import {AppStateService} from './shared/services';

import {CloseLeftMenuDirective} from './shared/directives';
import {NavigationMobileComponent} from './navigation';
import {CrowdMobileComponent} from './crowd';
import {FilterService, WebsocketService} from '../app/shared/services';
import {ProfileFooterMobileComponent} from './user-profile';
import {ConnectionsMobileComponent} from './connections';
import {SettingsMobileComponent} from './settings';
import {EventsMobileComponent} from './events';
import {MessagesMobileComponent} from './messages';
import {MyProfileMobileComponent} from './my-profile';
import {EditMyProfileMobileComponent} from './edit-my-profile';
import {HeaderComponent} from './header';
import {TermsOfServiceMobileComponent} from './info/terms-of-service';
import {PrivacyPolicyMobileComponent} from './info/privacy-policy';

import {HeaderState} from './header';

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
    useAsDefault: true,
    data: {
      headerState: HeaderState.crowd
    }
  },
  {
    path: '/connections',
    component: ConnectionsMobileComponent,
    name: 'Connections',
    data: {
      headerState: HeaderState.connections
    }
  },
  {
    path: '/settings',
    component: SettingsMobileComponent,
    name: 'Settings'
  },
  {
    path: '/events',
    component: EventsMobileComponent,
    name: 'Events'
  },
  {
    path: '/messages/...',
    component: MessagesMobileComponent,
    name: 'Messages',
    data: {
      headerState: HeaderState.messages
    }
  },
  {
    path: '/:username/edit-profile/...',
    component: EditMyProfileMobileComponent,
    name: 'EditMyProfile',
    data: {
      headerState: HeaderState.editMyProfile
    }
  },
  {
    path: '/:username',
    component: MyProfileMobileComponent,
    name: 'MyProfile'
  },
  {
    path: '/privacy',
    component: PrivacyPolicyMobileComponent,
    name: 'PrivacyPolicy',
    data: {
      headerState: HeaderState.privacyAndTerms
    }
  },
  {
    path: '/terms',
    component: TermsOfServiceMobileComponent,
    name: 'TermsOfService',
    data: {
      headerState: HeaderState.privacyAndTerms
    }
  }
])
@Component({
  selector: 'persice-mobile-app',
  template: require('./app-mobile.html'),
  providers: [
    FilterService,
    WebsocketService,
    AppStateService,
    HeaderState
  ],
  directives: [
    NavigationMobileComponent,
    CloseLeftMenuDirective,
    HeaderComponent,
    ProfileFooterMobileComponent
  ],
  encapsulation: ViewEncapsulation.None
})
export class AppMobileComponent implements OnInit {
  isFooterVisible: boolean = false;

  footerType: string;

  constructor(
    private websocketService: WebsocketService,
    private appStateService: AppStateService
  ) {

  }

  ngOnInit() {
    this.appStateService.isProfileFooterVisibleEmitter
      .subscribe((state: any) => {
        this.isFooterVisible = state.visibility;
        this.footerType = state.type ? state.type : '';
      });

    // Initialize and connect to socket.io websocket
    this.websocketService.connect();

  }

}
