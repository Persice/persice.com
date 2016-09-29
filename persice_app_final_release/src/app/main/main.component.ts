import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { FilterService } from '../../common/services/filter.service';
import { UserService } from '../../common/services/user.service';
import { NotificationService } from '../../common/services/notification.service';
import { WebsocketService } from '../../common/services/websocket.service';
import { GeolocationService } from '../../common/services/geolocation.service';
import { LocationService } from '../../common/services/location.service';
import { UserAuthService } from '../../common/services/userauth.service';
import { MessagesCounterService } from '../../common/services/messages_counter.service';
import { ConnectionsCounterService } from '../../common/services/connections_counter.service';
import { NotificationsService } from '../../common/services/notifications.service';
import { AuthUserModel } from '../../common/models/user/user.model';
import { IntercomUtil } from '../../common/core/util';
import { InterfaceNotification } from '../../common/models/notification/notification.model';
import { MyProfileService } from '../../common/services/myprofile.service';
import {
  UnreadMessagesCounterActions, NewConnectionsCounterActions, ConversationActions,
  MessageActions, SelectedPersonActions
} from '../../common/actions';
import { ConversationsService } from '../../common/services/conversations.service';
import { UnreadMessagesCounterService } from '../../common/services/unread-messages-counter.service';

@Component({
  selector: 'prs-main',
  templateUrl: './main.component.html',
  providers: [
    FilterService,
    UserService,
    NotificationService,
    WebsocketService,
    GeolocationService,
    LocationService,
    UserAuthService,
    ConnectionsCounterService,
    NotificationsService,
    MyProfileService,
    ConversationsService,
    UnreadMessagesCounterActions,
    NewConnectionsCounterActions,
    UnreadMessagesCounterService,
    ConversationActions,
    MessageActions,
    SelectedPersonActions
  ]

})
export class MainComponent implements OnInit, OnDestroy {
  activeRoute: string;
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
  routerSub;

  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private websocketService: WebsocketService,
    private locationService: LocationService,
    private geolocationService: GeolocationService,
    private unreadMessagesCounterService: UnreadMessagesCounterService,
    private connectionsCounterService: ConnectionsCounterService,
    private notificationsService: NotificationsService,
    private router: Router,
    private location: Location
  ) {
    this.activeRoute = this.location.path();
  }

  ngOnInit() {
    this.routerSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activeRoute = event.url;
      }
    });

    this.image = this.userService.getDefaultImage();

    this.userServiceObserver = this.userService.user$
      .subscribe((data: any) => {
        if (data.user) {
          this.image = data.user.info.image;
        }

      });

    //websocket initialise
    this.websocketService.connect();
    this.initWebsocket('messages:new');
    this.initWebsocket('messages:event');
    this.initWebsocket('connections:new');
    this.initWebsocket('event:deleted');

    // Get AuthUser info for the app
    this.userService.get()
      .subscribe(data => {
        this.assignAuthUser(data);
        IntercomUtil.boot(data);
      });

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
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
    this.notificationService.observer('app').unsubscribe();
    this.notificationService.removeObserver('app');
    this.userServiceObserver.unsubscribe();
    this.websocketService.disconnect();
  }

  initWebsocket(channel: string) {
    this.websocketService.on(channel).subscribe((data: any) => {
      switch (channel) {
        case 'messages:new':
          if (!!this.activeRoute && this.activeRoute.indexOf('messages') === -1) {
            this.unreadMessagesCounterService.refresh();
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
