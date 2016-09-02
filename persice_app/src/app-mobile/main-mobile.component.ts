import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { AppStateService } from './shared/services';
import { AppState, getUnreadMessagesCounterState, getNewConnectionsCounterState } from '../common/reducers';
import { Store } from '@ngrx/store';
import { TokenUtil } from '../common/core';
import { UnreadMessagesCounterService, NewConnectionsCounterService } from '../common/services';
import { CloseLeftMenuDirective } from './shared/directives';
import { NavigationMobileComponent } from './navigation';
import { HeaderComponent, HeaderState } from './header';
import { ProfileFooterMobileComponent } from './user-profile';
import { FooterButtonMobileComponent } from './footer-button';
import { GeolocationService } from '../app/shared/services/geolocation.service';
import { LocationService, UserLocation } from '../app/shared/services/location.service';
import { FilterService, WebsocketService } from '../app/shared/services';
import { UserService } from '../app/shared/services/user.service';
import { IntercomUtil } from '../common/core/util';

@Component({
  selector: 'persice-app-main-mobile',
  template: <any>require('./main-mobile.html'),
  providers: [
    FilterService,
    WebsocketService,
    AppStateService,
    HeaderState,
    GeolocationService,
    LocationService,
    UnreadMessagesCounterService,
    NewConnectionsCounterService,
    UserService,
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
export class MainMobileComponent implements OnInit, OnDestroy {
  username: string = '';
  unreadMessagesCounter: Observable<number>;
  newConnectionsCounter: Observable<number>;
  routerSub;

  constructor(
    private userService: UserService,
    private websocketService: WebsocketService,
    private geolocationService: GeolocationService,
    private locationService: LocationService,
    private store: Store<AppState>,
    private unreadMessagesCounterService: UnreadMessagesCounterService,
    private newConnectionsCounterService: NewConnectionsCounterService
  ) {
    this.username = TokenUtil.getValue('username');
    const unreadMessagesCounterStore$ = store.let(getUnreadMessagesCounterState());
    this.unreadMessagesCounter = unreadMessagesCounterStore$.map(state => state['counter']);

    const newConnectionsCounterStore$ = store.let(getNewConnectionsCounterState());
    this.newConnectionsCounter = newConnectionsCounterStore$.map(state => state['counter']);

  }

  ngOnInit() {
    // Get AuthUser info for the app
    this.userService.get()
      .subscribe(data => {
        IntercomUtil.boot(data);
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

  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
    this.websocketService.disconnect();
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
