import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { FilterService } from '../../common/services/filter.service';
import { WebsocketService } from '../../common/services/websocket.service';
import { AppStateService } from '../shared/services';
import { HeaderState } from './header';
import { GeolocationService } from '../../common/services/geolocation.service';
import { LocationService, UserLocation } from '../../common/services/location.service';
import { UnreadMessagesCounterService, NewConnectionsCounterService } from '../../common/services';
import { UserService } from '../../common/services/user.service';
import { AppState, getUnreadMessagesCounterState, getNewConnectionsCounterState } from '../../common/reducers';
import { TokenUtil, IntercomUtil } from '../../common/core';
import {
  UnreadMessagesCounterActions, NewConnectionsCounterActions, ConversationActions,
  MessageActions, SelectedPersonActions
} from '../../common/actions';

require('hammerjs');

@Component({
  selector: 'persice-app-mobile-main',
  templateUrl: './main-mobile.component.html',
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
    UnreadMessagesCounterActions,
    NewConnectionsCounterActions,
    ConversationActions,
    MessageActions,
    SelectedPersonActions
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
    this.unreadMessagesCounter = unreadMessagesCounterStore$.map(state => state[ 'counter' ]);

    const newConnectionsCounterStore$ = store.let(getNewConnectionsCounterState());
    this.newConnectionsCounter = newConnectionsCounterStore$.map(state => state[ 'counter' ]);

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
