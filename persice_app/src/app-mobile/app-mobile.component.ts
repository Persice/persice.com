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
import {CrowdMobileComponent} from "./crowd";
import {PageTitleComponent} from './page-title';
import {FilterService, WebsocketService} from '../app/shared/services';
import {AppStateService} from './shared/services';
import {ProfileFooterMobileComponent} from './user-profile';
import {ConnectionsMobileComponent} from './connections';
import {SettingsMobileComponent} from './settings';
import {EventsMobileComponent} from './events';
import {MessagesMobileComponent} from './messages';
import {MyProfileMobileComponent} from './my-profile';
import {EditMyProfileMobileComponent} from './edit-my-profile';

const PAGES_WITH_FILTER: string[] = ['crowd', 'connections'];
const PAGES_WITH_ADD_ACTION: string[] = ['messages'];

import {AppState, getConversationsState} from '../common/reducers';
import {Store} from '@ngrx/store';
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
  }
])
@Component({
  selector: 'persice-mobile-app',
  template: require('./app-mobile.html'),
  providers: [
    FilterService,
    AppStateService,
    WebsocketService
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
  footerScore: number = 0;
  footerType: string;
  footerUserId: number;

  constructor(
    private _appStateService: AppStateService,
    private _router: Router,
    private _store: Store<AppState>,
    private websocketService: WebsocketService
  ) {
    const store$ = _store.let(getConversationsState());
    this.conversationsCounter = store$.map(state => state['count']);
  }

  ngOnInit() {
    // Subscribe to EventEmmitter from AppStateService to show or hide main app header
    this._appStateService.isHeaderVisibleEmitter
      .subscribe((visibility: boolean) => {
        this.isHeaderVisible = visibility;
      });

    this._appStateService.isHeaderVisibleEmitter
      .subscribe((visibility: boolean) => {
        this.isHeaderVisible = visibility;
      });
    this._appStateService.isProfileFooterVisibleEmitter
      .subscribe((state: any) => {
        this.isFooterVisible = state.visibility;
        this.footerScore = state.score ? state.score : 0;
        this.footerType = state.type ? state.type : '';
        this.footerUserId = state.userId ? state.userId : null;
      });

    this._router.subscribe((next: string) => {
      this._onRouteChange(next);
    });

    // Initialize and connect to socket.io websocket
    this.websocketService.connect();
  }

  /**
   * Set Filter page visible using app state service
   */
  public setFilterVisible() {
    this._appStateService.setFilterVisibility(true);
    this._appStateService.setHeaderVisibility(false);
  }

  /**
   * Emit accept or pass state for friendship on crowd page
   * @param {Object} event {userid: number, state: [-1|0]}
   */
  public setFriendshipStatus(event) {
    this._appStateService.setFriendshipStatus(event);
  }

  /**
   * Change page title in top header when route changes
   * @param {string} next [description]
   */
  private _onRouteChange(next: string) {
    this.pageTitle = next;
  }

}
