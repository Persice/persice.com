import {Component, ViewEncapsulation, OnInit, ApplicationRef} from '@angular/core';
import {Observable} from 'rxjs';
import {ROUTER_DIRECTIVES, Router, NavigationEnd} from '@angular/router';

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
import {HeaderComponent} from './header';
import {ProfileFooterMobileComponent} from './user-profile';
import {FooterButtonMobileComponent} from './footer-button';

import {HeaderState} from './header';
import {GeolocationService} from "../app/shared/services/geolocation.service";
import {LocationService, UserLocation} from "../app/shared/services/location.service";
import {FilterService, WebsocketService} from '../app/shared/services';

/*
 * Persice App Component
 * Top Level Component
 */
@Component({
  selector: 'persice-mobile-app',
  template: <any>require('./app-mobile.html'),
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
    ROUTER_DIRECTIVES,
    NavigationMobileComponent,
    CloseLeftMenuDirective,
    HeaderComponent,
    ProfileFooterMobileComponent,
    FooterButtonMobileComponent
  ],
  encapsulation: ViewEncapsulation.None
})
export class AppMobileComponent implements OnInit {
  username: string = '';
  unreadMessagesCounter: Observable<number>;
  newConnectionsCounter: Observable<number>;

  constructor(
    private websocketService: WebsocketService,
    private geolocationService: GeolocationService,
    private locationService: LocationService,
    private store: Store<AppState>,
    private router: Router,
    private ref: ApplicationRef,
    private unreadMessagesCounterService: UnreadMessagesCounterService,
    private newConnectionsCounterService: NewConnectionsCounterService
  ) {
    this.username = CookieUtil.getValue('user_username');
    const unreadMessagesCounterStore$ = store.let(getUnreadMessagesCounterState());
    this.unreadMessagesCounter = unreadMessagesCounterStore$.map(state => state['counter']);

    const newConnectionsCounterStore$ = store.let(getNewConnectionsCounterState());
    this.newConnectionsCounter = newConnectionsCounterStore$.map(state => state['counter']);

    // Temporary fix for browser back button now working on IOS
    // https://github.com/angular/angular/issues/9565
    if (this.isMac()) {
      router.events.subscribe(ev => {
        if (ev instanceof NavigationEnd) {
          setTimeout(() => {
            if (ref.zone) {
              ref.zone.run(() => ref.tick());
            }
          });
        }
      })
    }
  }

  ngOnInit() {
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

  isMac() {
    if (navigator.userAgent.indexOf('Mac') > -1) {
      return true
    }
    return false
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
