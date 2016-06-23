import {Component, ViewEncapsulation, OnInit} from '@angular/core';
import {RouteConfig} from '@angular/router-deprecated';
import {Observable} from 'rxjs';

import {AppStateService} from './shared/services';
import {
  AppState,
  getUnreadMessagesCounterState,
  getNewConnectionsCounterState
} from '../common/reducers';
import {Store} from '@ngrx/store';
import {CookieUtil} from '../app/shared/core';
import {UnreadMessagesCounterService, NewConnectionsCounterService} from '../common/services';

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
import {GeolocationService} from "../app/shared/services/geolocation.service";
import {LocationService, UserLocation} from "../app/shared/services/location.service";

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
    HeaderState,
    GeolocationService,
    LocationService,
    UnreadMessagesCounterService,
    NewConnectionsCounterService
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
  username: string = '';
  unreadMessagesCounter: Observable<number>;
  newConnectionsCounter: Observable<number>;

  constructor(
    private websocketService: WebsocketService,
    private appStateService: AppStateService,
    private geolocationService: GeolocationService,
    private locationService: LocationService,
    private store: Store<AppState>,
    private unreadMessagesCounterService: UnreadMessagesCounterService,
    private newConnectionsCounterService: NewConnectionsCounterService
  ) {
    this.username = CookieUtil.getValue('user_username');
    const unreadMessagesCounterStore$ = store.let(getUnreadMessagesCounterState());
    this.unreadMessagesCounter = unreadMessagesCounterStore$.map(state => state['counter']);

    const newConnectionsCounterStore$ = store.let(getNewConnectionsCounterState());
    this.newConnectionsCounter = newConnectionsCounterStore$.map(state => state['counter']);
  }

  ngOnInit() {
    this.appStateService.isProfileFooterVisibleEmitter
      .subscribe((state: any) => {
        this.isFooterVisible = state.visibility;
        this.footerType = state.type ? state.type : '';
      });

    // Initialize and connect to socket.io websocket
    this.websocketService.connect();

    // Get unread messages counter
    this.unreadMessagesCounterService.refresh();

    // Get new connections counter
    this.newConnectionsCounterService.refresh();

    // If new message received via websocket, increase unread messages counter state.
    this.websocketService.on('messages:new').subscribe((data: any) => {
      this.unreadMessagesCounterService.increase();
    });

    // If new connection message received via websocket, increase new connections counter state.
    this.websocketService.on('connections:new').subscribe((data: any) => {
      this.newConnectionsCounterService.increase();
    });


    // Geolocation parameters.
    const GEOLOCATION_OPTS = {
      enableHighAccuracy: true,
      timeout: 60000,
      maximumAge: 0
    };

    // Get geolocation using JavaScript browser API.
    this.geolocationService.getLocation(GEOLOCATION_OPTS)
      .subscribe((res: UserLocation) => {
        this._updateOrCreateLocation(res);
      },
      (err) => {
        console.log('Geolocation Error: ', err);
      });
  }

  /**
   * Update the current user's location. If no record for the user exists on the backend, create a new one.
   * @param location
   * @private
   */
  private _updateOrCreateLocation(location: UserLocation) {
    this.locationService.updateOrCreate(location)
      .subscribe((res: UserLocation) => {
        this.locationService.updateLocation(res);
      },
      (err) => {
        console.log('Location saving error: ', err);
      });
  }
}
