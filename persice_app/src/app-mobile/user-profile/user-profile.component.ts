import {Component, Input, Output, EventEmitter, AfterViewInit} from '@angular/core';
import {RouterLink} from '@angular/router-deprecated';
import {OpenLeftMenuDirective} from '../shared/directives';
import {DROPDOWN_DIRECTIVES} from '../../common/directives/dropdown';
import {RemodalDirective} from '../../app/shared/directives';

import {GenderPipe} from '../../app/shared/pipes';
import {CheckImageDirective} from "../../app/shared/directives";
import {Person} from '../shared/model';
import {AboutMobileComponent} from './about';
import {PhotosMobileComponent} from './photos';
import {NetworkPreviewComponent} from './network-preview';
import {NetworkComponent} from './network';
import {ItemsListMobileComponent} from './items-list';
import {FriendUtil} from '../../app/shared/core';

import {MutualFriendsService} from '../../app/shared/services';
import {ConnectionsService} from '../../common/connections';
import {AppStateService} from '../shared/services';
import {LikesMobileComponent} from "./likes/likes-mobile.component";

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
    DROPDOWN_DIRECTIVES,
    RemodalDirective,
    AboutMobileComponent,
    ItemsListMobileComponent,
    NetworkPreviewComponent,
    NetworkComponent,
    OpenLeftMenuDirective,
    RouterLink,
    PhotosMobileComponent,
    LikesMobileComponent
  ],
  providers: [
    MutualFriendsService,
    ConnectionsService
  ]
})
export class UserProfileComponent implements AfterViewInit {
  // Profile type, crowd or connection
  @Input() type: string;

  @Input() username: string;

  // When [user] from Input property change, set internal state for our component
  @Input() set user(value) {
    // If value is defined, set person
    if (value) {
      this._setState(value);
    }
  }
  @Output() onCloseProfile: EventEmitter<any> = new EventEmitter();

  // Indicator for active view
  public activeView = ViewsType.Profile;
  public viewsType = ViewsType;

  // Person object which is displayed in the component template
  public person: Person;

  // Boolean flag which controls whether full profile information is collapsed and visible
  public profileExtraInfoVisible: boolean = false;

  // Indicator for which tab is active: interests(0), goals(1), offers(2)
  public activeTab: number = 0;

  // List and counters for mutual friends
  public friendsTotalCount: number = 0;
  public friendsPreview: any[] = [];
  public friendsPersice: any[] = [];
  public friendsFacebook: any[] = [];
  public friendsLinkedin: any[] = [];
  public friendsTwitterFollowers: any[] = [];
  public friendsTwitterFriends: any[] = [];

  // Boolean flag which checks if dropdown menu is opened
  public isDropdownOpen: boolean = false;

  // Remodal option
  public modalOptions = JSON.stringify({
    hashTracking: true,
    closeOnOutsideClick: true
  });

  constructor(
    private friendService: MutualFriendsService,
    private connectionsService: ConnectionsService,
    private appStateService: AppStateService
  ) {

  }

  ngAfterViewInit() {
    setTimeout(() => {
      window.scrollTo(0, 0);
    });
  }

  // TODO(sasa): Add API call to disconnect a connection
  public disconnect(event: MouseEvent) {
    console.log('disconnecting user');
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
    if (this.person.connectionsCount < 1) {
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
  }

  private toggleFooterVisibility(visible: boolean): void {
    this.appStateService.setProfileFooterVisibility({
      visibility: visible,
      type: this.type
    });
  }

  private _getMutualFriends(id) {
    this.friendService.get('', 100, id)
      .subscribe(data => {
        if (data.meta.total_count > 0) {
          let items = data.objects[0];
          this.friendsTotalCount += parseInt(items.mutual_bk_friends_count, 10);
          this.friendsTotalCount += parseInt(items.mutual_fb_friends_count, 10);
          this.friendsTotalCount += parseInt(items.mutual_linkedin_connections_count, 10);
          this.friendsTotalCount += parseInt(items.mutual_twitter_followers_count, 10);
          this.friendsTotalCount += parseInt(items.mutual_twitter_friends_count, 10);
          this.friendsPersice = items.mutual_bk_friends;
          this.friendsFacebook = items.mutual_fb_friends;
          this.friendsLinkedin = items.mutual_linkedin_connections;
          this.friendsTwitterFriends = items.mutual_twitter_friends;
          this.friendsTwitterFollowers = items.mutual_twitter_followers;

          // Pick four friends for preview
          this.friendsPreview = FriendUtil.pickFourFriendsforPreview(
            this.friendsPersice, this.friendsFacebook, this.friendsLinkedin,
            this.friendsTwitterFriends, this.friendsTwitterFollowers);
        }
      });
  }

  private _getConnections() {
    this.connectionsService.get('', 100, false)
      .subscribe((data) => {
        if (data.meta.total_count > 0) {
          let items = data.objects;
          this.friendsTotalCount = data.meta.total_count;
          this.friendsPersice = items;

          // Pick four friends for preview
          this.friendsPreview = FriendUtil.pickFourFriendsforPreview(this.friendsPersice, [], [], [], []);
        }
      });
  }

  private _setState(value: any) {
    this.person = new Person(value);
    if (this.type === 'crowd' || this.type === 'connection') {
      this._getMutualFriends(this.person.id);
    } else if (this.type === 'my-profile') {
      this._getConnections();
    }
  }

}
