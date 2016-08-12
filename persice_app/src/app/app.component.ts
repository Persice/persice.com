import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from '@angular/common';
import { ROUTER_DIRECTIVES, NavigationEnd, Router } from '@angular/router';
import { HeaderComponent } from './header';
import { NavigationComponent } from './navigation';
import { NotificationsComponent } from './notifications';
import { LoadingComponent } from './shared/components/loading';
import { NotificationComponent } from './shared/components/notification';
import { AuthUserModel, InterfaceNotification } from './shared/models';
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
  NotificationsService
} from './shared/services';

/*
 * Persice App Component
 * Top Level Component
 */

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
  template: <any>require('./app.html'),
  providers: [
    FilterService,
    UserService,
    NotificationService,
    WebsocketService,
    GeolocationService,
    LocationService,
    UserAuthService,
    MessagesCounterService,
    ConnectionsCounterService,
    NotificationsService
  ]
})
export class AppComponent implements OnInit, OnDestroy {
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
  userServiceObserver;

  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private websocketService: WebsocketService,
    private locationService: LocationService,
    private geolocationService: GeolocationService,
    private messagesCounterService: MessagesCounterService,
    private connectionsCounterService: ConnectionsCounterService,
    private notificationsService: NotificationsService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activeRoute = event.url;
      }
    });

    this.image = this.userService.getDefaultImage();

    this.userServiceObserver = this.userService.serviceObserver()
      .subscribe((data) => {
        this.image = data.user.info.image;
      });

    //websocket initialise
    this.websocketService.connect();
    this.initWebsocket('messages:new');
    this.initWebsocket('messages:event');
    this.initWebsocket('connections:new');
    this.initWebsocket('event:deleted');

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

  ngOnDestroy() {
    this.notificationService.observer('app').unsubscribe();
    this.notificationService.removeObserver('app');
    this.userServiceObserver.unsubscribe();
  }

  initWebsocket(channel: string) {
    this.websocketService.on(channel).subscribe((data: any) => {
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
