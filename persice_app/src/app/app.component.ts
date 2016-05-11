import {
  Component,
  Injectable,
  Type,
  ViewEncapsulation,
  AfterViewInit,
  OnInit,
  OnDestroy
} from '@angular/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from '@angular/common';
import {
  RouteConfig,
  ROUTER_DIRECTIVES,
  Router,
  RouteRegistry,
  AsyncRoute
} from '@angular/router-deprecated';

import {CookieUtil} from './shared/core';


import {HeaderComponent} from './header';
import {NavigationComponent} from './navigation';
import {NotificationsComponent} from './notifications';

import {LoadingComponent} from './shared/components/loading';
import {NotificationComponent} from './shared/components/notification';

import {CrowdDesktopComponent} from './crowd';

import {
  ProfileMyComponent
} from './profile';

import {AuthUserModel, InterfaceNotification} from './shared/models';


import {
  FilterService,
  UserService,
  UserAuthService,
  NotificationService,
  WebsocketService,
  GeolocationService,
  LocationService,
  MessagesCounterService,
  ConnectionsCounterService,
  HistoryService,
  NotificationsService
}
from './shared/services';

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
    component: CrowdDesktopComponent,
    name: 'Crowd',
    useAsDefault: true
  },
  new AsyncRoute({
    path: '/messages/...',
    loader: () => require('es6-promise!./messages')('MessagesComponent'),
    name: 'Messages'
  }),
  new AsyncRoute({
    path: '/event/:eventId',
    loader: () => require('es6-promise!./event')('EventComponent'),
    name: 'EventDetails'
  }),
  new AsyncRoute({
    path: '/connections',
    loader: () => require('es6-promise!./connections')('ConnectionsDesktopComponent'),
    name: 'Connections'
  }),
  new AsyncRoute({
    path: '/connections/:friendId',
    loader: () => require('es6-promise!./profile')('ProfileFriendComponent'),
    name: 'ProfileFriend'
  }),
  new AsyncRoute({
    path: '/events/...',
    loader: () => require('es6-promise!./events')('EventsComponent'),
    name: 'Events'
  }),
  new AsyncRoute({
    path: '/:username',
    loader: () => require('es6-promise!./profile')('ProfileLoader'),
    name: 'ProfileView'
  })
])
@Component({
  selector: 'persice-app',
  directives: [
    CORE_DIRECTIVES,
    FORM_DIRECTIVES,
    ROUTER_DIRECTIVES,
    HeaderComponent,
    NavigationComponent,
    LoadingComponent,
    NotificationComponent,
    NotificationsComponent
  ],
  encapsulation: ViewEncapsulation.None,
  template: require('./app.html'),
  providers: [
    FilterService,
    UserService,
    NotificationService,
    WebsocketService,
    GeolocationService,
    LocationService,
    UserAuthService,
    MessagesCounterService,
    HistoryService,
    ConnectionsCounterService,
    NotificationsService
  ]
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  activeRoute: string = '';
  user: AuthUserModel;
  image: string;
  loading: boolean;
  notificationMain = {
    body: '',
    title: '',
    active: false,
    type: ''
  };

  timeoutId = null;
  appRoutes: string[][];
  userServiceObserver;

  constructor(
    private _router: Router,
    private userService: UserService,
    private userAuthService: UserAuthService,
    private notificationService: NotificationService,
    private websocketService: WebsocketService,
    private locationService: LocationService,
    private geolocationService: GeolocationService,
    private messagesCounterService: MessagesCounterService,
    private connectionsCounterService: ConnectionsCounterService,
    private historyService: HistoryService,
    private notificationsService: NotificationsService
  ) {
    this.image = this.userService.getDefaultImage();
    let username = CookieUtil.getValue('user_username');

    this.userServiceObserver = this.userService.serviceObserver()
      .subscribe((data) => {
        this.image = data.user.info.image;
      });

  }

  ngAfterViewInit() {

    //websocket initialise
    this.websocketService.connect();
    this.initWebsocket('messages:new');
    this.initWebsocket('messages:event');
    this.initWebsocket('connections:new');
    this.initWebsocket('event:deleted');
  }

  initWebsocket(channel: string) {
    this.websocketService.on(channel).subscribe((data: any) => {
      console.log('websocket recieved data for channel %s', channel);
      console.log(data);
      switch (channel) {
        case 'messages:new':
          if (this.activeRoute.indexOf('messages') === -1) {
            this.messagesCounterService.refreshCounter();
            this.notificationsService.set({
              title: `1 new message from ${data.sender_name}`,
              body: data.body,
              data: {
                sender_id: data.friend_id
              },
              type: 'message'
            }, true);
          }
          break;
        case 'connections:new':
          setTimeout(() => {
            this.notificationsService.set({
              title: `You and <strong>${data.friend_name}</strong> are now connected!`,
              body: '',
              data: {
                username: data.friend_username
              },
              type: 'connection'
            }, true);
            this.connectionsCounterService.refreshCounter();
          }, 2000);
          break;
        default:
          break;
      }

    });
  }

  ngOnInit() {
    console.log('hello App component');

    this._router.subscribe((next) => {
      this.activeRoute = next;
      this.historyService.setRoute(next);
    });


    // Get AuthUser info for the app
    this.userService.get()
      .subscribe(data => this.assignAuthUser(data));

    //create new observer and subscribe for notification service
    this.notificationService.addObserver('app');
    this.notificationService.observer('app')
      .subscribe(
      (data) => this.showNotification(data),
      (err) => {
        console.log('Notification error %s', err);
      });

    // Get geolocation from the browser
    const GEOLOCATION_OPTS = {
      enableHighAccuracy: true,
      timeout: 60000,
      maximumAge: 0
    };

    this.geolocationService.getLocation(GEOLOCATION_OPTS)
      .subscribe((res: any) => {
        this.updateOrCreateLocation(res);
      },
      (err) => {
        console.log('Geolocation Error: ', err);
      },
      () => {
      });
  }

  updateOrCreateLocation(loc) {
    this.locationService.updateOrCreate(loc)
      .subscribe((res) => {
        this.locationService.updateLocation(res);
      },
      (err) => {
        console.log('Location saving error: ', err);
      },
      () => {

      });
  }

  ngOnDestroy() {
    this.notificationService.observer('app').unsubscribe();
    this.notificationService.removeObserver('app');
    this.userServiceObserver.unsubscribe();
  }

  showNotification(data: InterfaceNotification) {
    this.notificationMain.body = data.body;
    this.notificationMain.type = data.type;
    this.notificationMain.title = data.title;
    this.notificationMain.active = true;

    //autoclose notification if autoclose option enabled
    if (data.autoclose > 0) {
      this.closeNotification(data.autoclose);
    }

  }

  closeNotification(timeout) {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }
    this.timeoutId = setTimeout(() => {
      this.notificationMain.active = false;
    }, timeout);
  }

  // Assign AuthUser user from the /me Api
  assignAuthUser(data) {
    this.user = new AuthUserModel(data);
    this.image = this.user.info.image;
  }




}
