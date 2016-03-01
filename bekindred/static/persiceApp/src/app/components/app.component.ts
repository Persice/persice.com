/*
 * Angular 2 decorators and services
 */
import {Component, NgZone, ViewEncapsulation, Injectable, Type} from 'angular2/core';

/*
 * Angular Directives
 */
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {RouteConfig, ROUTER_DIRECTIVES, Router, RouteRegistry, AsyncRoute}
from 'angular2/router';

import {CookieUtil} from '../core/util';

/*
 * Components
 */
import {HomeComponent} from './home/home.component';
import {CrowdComponent} from './crowd/crowd.component';
import {MessagesComponent} from './messages/messages.component';
import {ConnectionsComponent} from './connections/connections.component';
import {EventsComponent} from './events/events.component';
import {ProfileFriendComponent} from './profile/profile_friend.component';
import {EventComponent} from './event/event.component';
import {ProfileViewComponent} from './profile/profile_view.component';
import {ProfileLoader} from './profile/profile_loader';
import {ProfileMyComponent} from './profile/profile_my.component';
import {NotificationsContainerComponent} from './notifications/notifications_container.component';

import {HeaderMainComponent} from './headermain/headermain.component';
import {HeaderSubComponent} from './headersub/headersub.component';
import {LoadingComponent} from './loading/loading.component';
import {NotificationComponent} from './notification/notification.component';

import {AuthUserModel} from '../models/user.model';
import {InterfaceNotification} from '../models/notification.model';

/*
 * Services available to child components
 */
import {FilterService} from '../services/filter.service';
import {UserService} from '../services/user.service';
import {UserAuthService} from '../services/userauth.service';
import {NotificationService} from '../services/notification.service';
import {EventsService} from '../services/events.service';
import {EventService} from '../services/event.service';
import {WebsocketService} from '../services/websocket.service';
import {GeolocationService} from '../services/geolocation.service';
import {LocationService} from '../services/location.service';
import {MessagesCounterService} from '../services/messages_counter.service';
import {ConnectionsCounterService} from '../services/connections_counter.service';
import {HistoryService} from '../services/history.service';
import {NotificationsService} from '../services/notifications.service';

let view = require('./app.html');


declare var Reflect: any;

@Injectable()
class DynamicRouteConfiguratorService {
  constructor(private registry: RouteRegistry) { }
  addRoute(component: Type, route) {
    let routeConfig = this.getRoutes(component);
    routeConfig.configs.push(route);
    this.updateRouteConfig(component, routeConfig);
    this.registry.config(component, route);
  }
  removeRoute() {
    // need to touch private APIs - bad
  }
  getRoutes(component: Type) {
    return Reflect.getMetadata('annotations', component)
      .filter(a => {
        return a.constructor.name === 'RouteConfig';
      }).pop();
  }
  updateRouteConfig(component: Type, routeConfig) {
    let annotations = Reflect.getMetadata('annotations', component);
    let routeConfigIndex = -1;
    for (let i = 0; i < annotations.length; i += 1) {
      if (annotations[i].constructor.name === 'RouteConfig') {
        routeConfigIndex = i;
        break;
      }
    }
    if (routeConfigIndex < 0) {
      throw new Error('No route metadata attached to the component');
    }
    annotations[routeConfigIndex] = routeConfig;
    Reflect.defineMetadata('annotations', annotations, { AppComponent });
  }
}


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
    component: CrowdComponent,
    // loader: () => require('es6-promise!./crowd/crowd.component')('CrowdComponent'),
    name: 'Crowd'
  },
  new AsyncRoute({
    path: '/messages/...',
    loader: () => require('es6-promise!./messages/messages.component')('MessagesComponent'),
    name: 'Messages'
  }),
  new AsyncRoute({
    path: '/event/:eventId',
    loader: () => require('es6-promise!./event/event.component')('EventComponent'),
    name: 'EventDetails'
  }),
  new AsyncRoute({
    path: '/connections',
    loader: () => require('es6-promise!./connections/connections.component')('ConnectionsComponent'),
    name: 'Connections'
  }),
  new AsyncRoute({
    path: '/connections/:friendId',
    loader: () => require('es6-promise!./profile/profile_friend.component')('ProfileFriendComponent'),
    name: 'ProfileFriend'
  }),
  new AsyncRoute({
    path: '/events/...',
    loader: () => require('es6-promise!./events/events.component')('EventsComponent'),
    name: 'Events'
  }),
  new AsyncRoute({
    path: '/:username',
    loader: () => require('es6-promise!./profile/profile_loader')('ProfileLoader'),
    name: 'ProfileView'
  })
])
@Component({
  selector: 'persice-app',
  encapsulation: ViewEncapsulation.None,
  directives: [
    CORE_DIRECTIVES,
    FORM_DIRECTIVES,
    ROUTER_DIRECTIVES,
    HeaderMainComponent,
    HeaderSubComponent,
    LoadingComponent,
    NotificationComponent,
    NotificationsContainerComponent
  ],
  template: view,
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
    DynamicRouteConfiguratorService,
    ConnectionsCounterService,
    NotificationsService
  ]
})
export class AppComponent {
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
    private dynamicRouteConfiguratorService: DynamicRouteConfiguratorService,
    private notificationsService: NotificationsService,
    private _zone: NgZone
  ) {
    //default image
    this.image = this.userService.getDefaultImage();
    let username = CookieUtil.getValue('user_username');
    //dynamically set myprofile route
    this.appRoutes = this.getAppRoutes();
    setTimeout(_ => {
      let route = { path: '/' + username, component: ProfileMyComponent, as: 'ProfileMy' };
      this.dynamicRouteConfiguratorService.addRoute(this.constructor, route);
      this.appRoutes = this.getAppRoutes();
    }, 500);

    this.userServiceObserver = this.userService.serviceObserver()
      .subscribe((data) => {
        this.image = data.user.info.image;
      });

  }

  public getAppRoutes(): string[][] {
    return this.dynamicRouteConfiguratorService
      .getRoutes(this.constructor).configs.map(route => {
        return { path: [`/${route.as}`], name: route.as };
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
    this.user = new AuthUserModel(data.objects[0]);
    this.image = this.user.info.image;
  }




}
