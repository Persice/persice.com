/*
 * Angular 2 decorators and services
 */
import {Component, NgZone} from 'angular2/core';
import {HTTP_BINDINGS} from 'angular2/http';

/*
 * Angular Directives
 */
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {RouteConfig, ROUTER_DIRECTIVES, Router} from 'angular2/router';

import {StringUtil} from '../core/util';


/*
 * Components
 */
import {HomeComponent} from './home/home.component';
import {CrowdComponent} from './crowd/crowd.component';
import {MessagesComponent} from './messages/messages.component';
import {ConnectionsComponent} from './connections/connections.component';
import {EventsComponent} from './events/events.component';
import {ProfileFriendComponent} from './profile/profile_friend.component';
import {ProfileMyComponent} from './profile/profile_my.component';
import {EventComponent} from './event/event.component';
import {ProfileViewComponent} from './profile/profile_view.component';

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
import {HistoryService} from '../services/history.service';

let view = require('./app.html');


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
    name: 'Crowd'
  },
  {
    path: '/messages/...',
    component: MessagesComponent,
    name: 'Messages'
  },
  {
    path: '/event/:eventId',
    component: EventComponent,
    name: 'EventDetails'
  },
  {
    path: '/connections',
    component: ConnectionsComponent,
    name: 'Connections'
  },
  {
    path: '/connections/:friendId',
    component: ProfileFriendComponent,
    name: 'ProfileFriend'
  },
  {
    path: '/events/...',
    component: EventsComponent,
    name: 'Events'
  },
  {
    path: '/myprofile',
    component: ProfileMyComponent,
    name: 'ProfileMy'
  },
  {
    path: '/:username',
    component: ProfileViewComponent,
    name: 'ProfileView'
  }
])
@Component({
  selector: 'persice-app',
  viewBindings: [HTTP_BINDINGS],
  directives: [
    CORE_DIRECTIVES,
    FORM_DIRECTIVES,
    ROUTER_DIRECTIVES,
    HeaderMainComponent,
    HeaderSubComponent,
    LoadingComponent,
    NotificationComponent
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
    HistoryService
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
  notificationSmall = {
    body: '',
    title: '',
    active: false,
    type: '',
    payload: null
  };
  timeoutId = null;
  timeoutNotification = null;

  constructor(
    private _router: Router,
    private userService: UserService,
    private userAuthService: UserAuthService,
    private notificationService: NotificationService,
    private websocketService: WebsocketService,
    private locationService: LocationService,
    private geolocationService: GeolocationService,
    private messagesCounterService: MessagesCounterService,
    private historyService: HistoryService,
    private _zone: NgZone
  ) {
    //default image
    this.image = this.userService.getDefaultImage();

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
            this.userAuthService.findByUri(data.sender)
              .subscribe((res) => {
                this.notificationSmall = {
                  body: StringUtil.words(data.body, 30),
                  title: '1 new message from ' + res.first_name,
                  active: true,
                  type: 'message',
                  payload: {
                    id: res.id
                  }
                };

                if (this.timeoutNotification) {
                  window.clearTimeout(this.timeoutNotification);
                }

                this.timeoutNotification = setTimeout(() => {
                  this.notificationSmall.active = false;
                }, 4000);
              });
              this.messagesCounterService.refreshCounter();
          }

          break;
        default:
          break;
      }

    });
  }

  closeSmallNotification(event) {
    this.notificationSmall.active = false;
  }

  performNotificationAction(event) {
    if (this.notificationSmall.type === 'message') {
      this._router.navigate(['Messages', 'SingleConversation', { 'threadId': this.notificationSmall.payload.id }]);
      this.closeSmallNotification(true);
    }
  }

  ngOnInit() {
    console.log('hello App component');

    this._router.subscribe((next) => {
      this.activeRoute = next;
      this.historyService.setRoute(next);
      // console.log(this.historyService.getAll());
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
      },
      () => console.log('event completed')
      );

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
    this.timeoutId = setTimeout(
      () => {
        this.notificationMain.active = false;
      },
      timeout
    );
  }

  // Assign AuthUser user from the /me Api
  assignAuthUser(data) {
    this.user = new AuthUserModel(data.objects[0]);
    this.image = this.user.info.image;
  }




}
