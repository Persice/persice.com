import {Component, Input, OnInit, OnDestroy, AfterViewInit, Output, EventEmitter} from '@angular/core';
import {Subscription, Observable} from 'rxjs';

import {OpenLeftMenuDirective} from '../shared/directives';
import {RemodalDirective} from '../../app/shared/directives';

import {GenderPipe} from '../../app/shared/pipes';
import {CheckImageDirective} from '../../app/shared/directives';
import {Person} from '../shared/model';
import {AboutMobileComponent} from './about';
import {PhotosMobileComponent} from './photos';
import {NetworkPreviewComponent} from './network-preview';
import {NetworkComponent} from './network';
import {ItemsListMobileComponent} from './items-list';

import {AppStateService} from '../shared/services';
import {LikesMobileComponent} from './likes/likes-mobile.component';
import {FriendService} from '../../app/shared/services';
import {MutualFriendsService} from '../../app/shared/services';
import {ConnectionsService} from '../../common/connections';
import {FriendUtil} from '../../app/shared/core';

import {HeaderState} from '../header';
import {AppState, getSelectedPersonState} from "../../common/reducers/index";
import {Store} from "@ngrx/store";
import {SelectedPersonActions} from "../../common/actions/selected-person.action";

enum ViewsType {
  Profile,
  Photos,
  Network,
  Likes
}

@Component({
  selector: 'prs-user-profile',
  template: require('./user-profile.html'),
  pipes: [GenderPipe],
  directives: [
    CheckImageDirective,
    RemodalDirective,
    AboutMobileComponent,
    ItemsListMobileComponent,
    NetworkPreviewComponent,
    NetworkComponent,
    OpenLeftMenuDirective,
    PhotosMobileComponent,
    LikesMobileComponent
  ],
  providers: [FriendService, MutualFriendsService, ConnectionsService]
})
export class UserProfileComponent implements AfterViewInit, OnInit, OnDestroy {
  // Profile type, crowd or connection
  @Input() type: string;

  @Input() username: string;

  @Input() isStandalonePage: boolean = false;

  // When [user] from Input property change, set internal state for our component
  @Input() set user(value) {
    // If value is defined, set person
    if (value) {
      this._setState(value);
    }
  }

  @Output() public profileClosedEvent: EventEmitter<any> = new EventEmitter;

  // Indicator for active view
  public activeView = ViewsType.Profile;
  public viewsType = ViewsType;

  // Person object which is displayed in the component template
  public person: Person;

  // Boolean flag which controls whether full profile information is collapsed and visible
  public profileExtraInfoVisible: boolean = false;

  // Indicator for which tab is active: interests(0), goals(1), offers(2)
  public activeTab: number = 0;

  // Boolean flag which checks if dimmed overlay over user profile is visible
  public isOverlayVisible: boolean = false;

  // Remodal option
  public modalOptions = JSON.stringify({
    hashTracking: false,
    closeOnOutsideClick: true
  });

  // Counters for all connections and mutual connections
  public otherConnectionsCount: number = 0;
  public mutualConnectionsCount: number = 0;

  // List for preview
  public connectionsPreview: any[] = [];

  // Lists for mutual friends
  public connectionsMutualPersice: any[] = [];
  public connectionsMutualFacebook: any[] = [];
  public connectionsMutualLinkedin: any[] = [];
  public connectionsMutualTwitterFollowers: any[] = [];
  public connectionsMutualTwitterFriends: any[] = [];

  private appStateServiceInstance;

  private accepted$: Observable<boolean>;
  private passed$: Observable<boolean>;

  constructor(
    private appStateService: AppStateService,
    private friendService: FriendService,
    private mutualFriendService: MutualFriendsService,
    private connectionsService: ConnectionsService,
    private store: Store<AppState>,
    private actions: SelectedPersonActions
  ) {
    const store$ = store.let(getSelectedPersonState());
    this.accepted$ = store$.map((data) => data['accept']);
    this.passed$ = store$.map((data) => data['pass']);

    this.accepted$.subscribe((status: boolean) => {
      if (!!status) {
        this._saveFriendshipStatus(0);
      }
    });

    this.passed$.subscribe((status: boolean) => {
      if (!!status) {
        this._saveFriendshipStatus(-1);
      }

    });
  }

  ngOnInit(): any {
    this.appStateServiceInstance = this.appStateService.isUserProfileVisibleEmitter.subscribe((visible: boolean) => {
      if (!!visible) {
        this.showProfileView(undefined);
      }
    });


    this.makeProfileHeaderVisible();
  }

  ngOnDestroy(): any {
    this.appStateServiceInstance.unsubscribe();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      window.scrollTo(0, 0);
      if (this.type === 'crowd') {
        this.toggleFooterVisibility(true);
      }
    });
  }

  public makeProfileHeaderVisible() {
    if (this.type === 'my-profile') {
      this.appStateService.headerStateEmitter.emit(HeaderState.myProfile);
    }

    if (this.type === 'crowd') {
      this.appStateService.headerStateEmitter.emit(HeaderState.userProfileWithBack);
    }

    if (this.type === 'connection') {
      this.appStateService.headerStateEmitter.emit(HeaderState.userProfileWithBackAndMenu);
    }

    if (this.isStandalonePage) {
      if (!!this.person.connected) {
        this.appStateService.headerStateEmitter.emit(HeaderState.userProfileWithMenu);
      } else {
        this.appStateService.headerStateEmitter.emit(HeaderState.userProfile);
      }
    }
  }

  /**
   * Disconnects a connection
   * @param {MouseEvent} event
   */
  public disconnect(event: MouseEvent) {
    let subs: Subscription = this.friendService.disconnect(this.person.id)
      .subscribe((data: any) => {
        this.appStateService.userProfileDisconnected.emit(this.person.id);
        subs.unsubscribe();
      }, (err) => {
        subs.unsubscribe();
      });
  }

  public toggleProfileExtraInfoVisibility(event) {
    this.profileExtraInfoVisible = !this.profileExtraInfoVisible;
  }

  /**
   * Activate interests, goals or offers tab
   * @param {number} tab active tab: interests(0), goals(1), offers(2)
   */
  public activateTab(tab: number) {
    this.activeTab = tab;
  }

  public showNetworkView(event): void {
    if (this.otherConnectionsCount + this.mutualConnectionsCount < 1) {
      // Do nothing.
      return;
    }

    this.activeView = this.viewsType.Network;
    this.toggleFooterVisibility(false);
  }

  public showPhotosView(event): void {
    this.activeView = this.viewsType.Photos;
    this.toggleFooterVisibility(false);
  }

  public showLikesView(event): void {
    if (this.person.likesCount + this.person.likesMutualCount < 1) {
      // Do nothing.
      return;
    }

    this.activeView = this.viewsType.Likes;
    this.toggleFooterVisibility(false);
  }

  public showProfileView(event: any): void {
    this.activeView = this.viewsType.Profile;
    if (this.type !== 'my-profile') {
      this.toggleFooterVisibility(true);
    }

    this.makeProfileHeaderVisible();

  }

  private toggleFooterVisibility(visible: boolean): void {
    this.appStateService.setProfileFooterVisibility({
      visibility: visible,
      type: this.type
    });
  }

  private _getMutualConnections(id) {
    let subs: Subscription = this.mutualFriendService.get('', 1, id)
      .subscribe(data => {
        if (data.meta.total_count > 0) {
          let items = data.objects[0];
          this.mutualConnectionsCount += parseInt(items.mutual_bk_friends_count, 10);
          this.mutualConnectionsCount += parseInt(items.mutual_fb_friends_count, 10);
          this.mutualConnectionsCount += parseInt(items.mutual_linkedin_connections_count, 10);
          this.mutualConnectionsCount += parseInt(items.mutual_twitter_followers_count, 10);
          this.mutualConnectionsCount += parseInt(items.mutual_twitter_friends_count, 10);

          this.connectionsMutualPersice = items.mutual_bk_friends;
          this.connectionsMutualFacebook = items.mutual_fb_friends;
          this.connectionsMutualLinkedin = items.mutual_linkedin_connections;
          this.connectionsMutualTwitterFriends = items.mutual_twitter_friends;
          this.connectionsMutualTwitterFollowers = items.mutual_twitter_followers;

          // Pick four connections for preview
          this.connectionsPreview = FriendUtil.pickFourFriendsforPreview(
            this.connectionsMutualPersice, this.connectionsMutualFacebook, this.connectionsMutualLinkedin,
            this.connectionsMutualTwitterFriends, this.connectionsMutualTwitterFollowers);
          subs.unsubscribe();
        }
      });
  }

  private _getMyConnections() {
    let subs: Subscription = this.connectionsService.get('', 4, false)
      .subscribe((data) => {
        if (data.meta.total_count > 0) {
          let items = data.objects;
          this.otherConnectionsCount = data.meta.total_count;
          // Pick four connections for preview
          this.connectionsPreview = FriendUtil.pickFourFriendsforPreview(items, [], [], [], []);
          subs.unsubscribe();
        }
      });
  }

  private _setState(user: any) {
    this.person = new Person(user);
    this.store.dispatch(this.actions.set(this.person, this.type));

    if (this.type === 'crowd' || this.type === 'connection') {
      this._getMutualConnections(this.person.id);

      if (this.username) {
        this.setBrowserLocationUrl(`/${this.username}`);
      } else if (user.username) {
        this.setBrowserLocationUrl(`/${user.username}`);
      }

    } else if (this.type === 'my-profile') {
      this._getMyConnections();
    }
  }

  private setBrowserLocationUrl(path: string) {
    window.history.pushState('', '', `${path}`);
  }

  private _saveFriendshipStatus(status: number): void {
    if (!!this.person) {
      const id: string = this.person.id;
      this.friendService.saveFriendship(status, id)
        .subscribe(data => {
          this.closeView();
        }, (err) => {
          this.closeView();
        });
    }
  }

  private closeView() {
    if (this.isStandalonePage) {
      this.toggleFooterVisibility(false);
      window.history.go(-2);
    } else {
      this.profileClosedEvent.emit(this.person.id);
    }
  }
}
