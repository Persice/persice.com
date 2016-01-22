import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/core';

/** Base Class */
import {BaseProfileComponent} from './base_profile.component';

/** Components */
import {ProfileAvatarComponent} from '../profile_avatar/profile_avatar.component';
import {ProfileAboutComponent} from '../profile_about/profile_about.component';
import {ProfileLikesComponent} from '../profile_likes/profile_likes.component';
import {ProfileFriendsComponent} from '../profile_friends/profile_friends.component';
import {ProfileNetworksComponent} from '../profile_networks/profile_networks.component';
import {ProfileItemsComponent} from '../profile_items/profile_items.component';
import {ProfileEditComponent} from '../profile_edit/profile_edit.component';

/** Services */
import {UserProfileService} from '../../services/userprofile.service';
import {ConnectionsService} from '../../services/connections.service';

//** Directives */
import {RemodalDirective} from '../../directives/remodal.directive';

/** Utils */

/** View */
let view = require('./profile.html');

@Component({
  selector: 'profile-friend',
  template: view,
  directives: [
    ProfileAvatarComponent,
    ProfileAboutComponent,
    ProfileLikesComponent,
    ProfileFriendsComponent,
    ProfileNetworksComponent,
    ProfileItemsComponent,
    ProfileEditComponent,
    RemodalDirective
  ],
  providers: [
    UserProfileService,
    ConnectionsService
  ]
})
export class ProfileMyComponent extends BaseProfileComponent {
  user;
  userEdit;
  friendsTitle: string = 'Connections';
  loading: boolean = false;

  profileReligiousIndex = [];
  profilePoliticalIndex = [];

  instanceServiceConnections;

  constructor(
    public userProfileService: UserProfileService,
    public connectionsService: ConnectionsService
  ) {
    super(userProfileService, 'my');
  }

  ngOnInit() {
    this.assignUser();
    this.getConnections();
  }


  closeProfile(event) {
    this.unsubscribe();
    this.unsubscribeRefresh();
    this.unsubscribeConnections();
    window.history.back();
  }

  getConnections() {
    this.instanceServiceConnections = this.connectionsService.get('', 100, false)
      .subscribe((data: any) => {
        this.assignConnections(data);
      })

  }

  private assignConnections(data) {
    if (data.meta.total_count > 0) {
      let items = data.objects;
      this.profileFriendsCount = items.length;
      this.profileFriends.mutual_bk_friends = items;
    }
  }

  unsubscribeConnections() {
    if (this.serviceInstanceRefresh) {
      this.loading = false;
      this.serviceInstanceRefresh.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.unsubscribe();
    this.unsubscribeRefresh();
    this.unsubscribeConnections();
  }


}
