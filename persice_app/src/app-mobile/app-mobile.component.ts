import {
  Component,
  ViewEncapsulation,
  OnInit
} from '@angular/core';

import {CORE_DIRECTIVES, FORM_DIRECTIVES} from '@angular/common';

import {
  RouteConfig,
  ROUTER_DIRECTIVES,
  Router
} from '@angular/router-deprecated';

import {Observable} from 'rxjs';

import {
  OpenLeftMenuDirective,
  CloseLeftMenuDirective,
  IfRoutesActiveDirective
} from './shared/directives';
import {NavigationMobileComponent} from './navigation';
import {CrowdMobileComponent} from './crowd';
import {PageTitleComponent} from './page-title';
import {FilterService, WebsocketService} from '../app/shared/services';
import {AppStateService} from './shared/services';
import {UnreadMessagesCounterService, NewConnectionsCounterService} from '../common/services';
import {ProfileFooterMobileComponent} from './user-profile';
import {ConnectionsMobileComponent} from './connections';
import {SettingsMobileComponent} from './settings';
import {EventsMobileComponent} from './events';
import {MessagesMobileComponent} from './messages';
import {MyProfileMobileComponent} from './my-profile';
import {EditMyProfileMobileComponent} from './edit-my-profile';

const PAGES_WITH_FILTER: string[] = ['crowd', 'connections'];
const PAGES_WITH_ADD_ACTION: string[] = ['messages'];

import {
  AppState,
  getConversationsState,
  getUnreadMessagesCounterState,
  getNewConnectionsCounterState
} from '../common/reducers';
import {Store} from '@ngrx/store';
import {CookieUtil} from '../app/shared/core';
import {TermsOfServiceMobileComponent} from "./info/terms-of-service/terms-of-service-mobile.component";
import {PrivacyPolicyMobileComponent} from "./info/privacy-policy/privacy-policy-mobile.component";

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
    useAsDefault: true
  },
  {
    path: '/connections',
    component: ConnectionsMobileComponent,
    name: 'Connections'
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
    name: 'Messages'
  },
  {
    path: '/:username/edit-profile/...',
    component: EditMyProfileMobileComponent,
    name: 'EditMyProfile'
  },
  {
    path: '/:username',
    component: MyProfileMobileComponent,
    name: 'MyProfile'
  },
  {
    path: '/privacy',
    component: PrivacyPolicyMobileComponent,
    name: 'PrivacyPolicy'
  },
  {
    path: '/terms',
    component: TermsOfServiceMobileComponent,
    name: 'TermsOfService'
  }
])
@Component({
  selector: 'persice-mobile-app',
  template: require('./app-mobile.html'),
  providers: [
    FilterService,
    AppStateService,
    WebsocketService,
    UnreadMessagesCounterService,
    NewConnectionsCounterService
  ],
  directives: [
    CORE_DIRECTIVES,
    FORM_DIRECTIVES,
    ROUTER_DIRECTIVES,
    NavigationMobileComponent,
    OpenLeftMenuDirective,
    CloseLeftMenuDirective,
    IfRoutesActiveDirective,
    PageTitleComponent,
    ProfileFooterMobileComponent
  ],
  encapsulation: ViewEncapsulation.None
})
export class AppMobileComponent implements OnInit {
  isHeaderVisible: boolean = true;
  isFooterVisible: boolean = false;
  pagesWithFilter = PAGES_WITH_FILTER;
  pagesWithAddAction = PAGES_WITH_ADD_ACTION;
  pageTitle: string = 'Persice';
  conversationsCounter: Observable<number>;
  unreadMessagesCounter: Observable<number>;
  newConnectionsCounter: Observable<number>;
  footerType: string;
  username: string = '';

  constructor(
    private appStateService: AppStateService,
    private router: Router,
    private store: Store<AppState>,
    private websocketService: WebsocketService,
    private unreadMessagesCounterService: UnreadMessagesCounterService,
    private newConnectionsCounterService: NewConnectionsCounterService
  ) {
    this.username = CookieUtil.getValue('user_username');

    const conversationsStore$ = store.let(getConversationsState());
    this.conversationsCounter = conversationsStore$.map(state => state['count']);

    const unreadMessagesCounterStore$ = store.let(getUnreadMessagesCounterState());
    this.unreadMessagesCounter = unreadMessagesCounterStore$.map(state => state['counter']);

    const newConnectionsCounterStore$ = store.let(getNewConnectionsCounterState());
    this.newConnectionsCounter = newConnectionsCounterStore$.map(state => state['counter']);
  }

  ngOnInit() {
    // Subscribe to EventEmmitter from AppStateService to show or hide main app header
    this.appStateService.isHeaderVisibleEmitter
      .subscribe((visibility: boolean) => {
        this.isHeaderVisible = visibility;
      });

    this.appStateService.isHeaderVisibleEmitter
      .subscribe((visibility: boolean) => {
        this.isHeaderVisible = visibility;
      });
    this.appStateService.isProfileFooterVisibleEmitter
      .subscribe((state: any) => {
        this.isFooterVisible = state.visibility;
        this.footerType = state.type ? state.type : '';
      });

    this.router.subscribe((next: string) => {
      this._onRouteChange(next);
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
  }

  /**
   * Set Filter page visible using app state service
   */
  public setFilterVisible() {
    this.appStateService.setFilterVisibility(true);
    this.appStateService.setHeaderVisibility(false);
  }

  public performAddAction() {
    if (this.router.isRouteActive(this.router.generate(['/Messages', 'Conversations']))) {
      this.router.navigate(['/Messages', 'NewConversation']);
    }
  }

  /**
   * Change page title in top header when route changes
   * @param {string} next [description]
   */
  private _onRouteChange(next: string) {
    this.pageTitle = next;
  }

}
