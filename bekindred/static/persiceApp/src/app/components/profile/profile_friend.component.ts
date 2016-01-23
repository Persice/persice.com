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
import {LoadingComponent} from '../loading/loading.component';

/** Directives */
import {DropdownDirective} from '../../directives/dropdown.directive';

/** Services */
import {MutualFriendsService} from '../../services/mutualfriends.service';
import {PhotosService} from '../../services/photos.service';
import {ReligiousViewsService} from '../../services/religiousviews.service';
import {PoliticalViewsService} from '../../services/politicalviews.service';

/** Utils */
import {ObjectUtil} from '../../core/util';

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
    DropdownDirective,
    LoadingComponent
  ],
  providers: [
    PhotosService,
    ReligiousViewsService
  ]
})
export class ProfileFriendComponent extends BaseProfileComponent {
  @Input() user;
  @Input() count;
  @Input() currentIndex;
  @Output() closeprofileEvent: EventEmitter<any> = new EventEmitter;
  @Output() nextEvent: EventEmitter<any> = new EventEmitter;
  @Output() previousEvent: EventEmitter<any> = new EventEmitter;
  friendsTitle: string = 'Mutual Connections';

  constructor(
    public mutualfriendsService: MutualFriendsService,
    public photosService: PhotosService,
    public religiousviewsService: ReligiousViewsService,
    public politicalviewsService: PoliticalViewsService
  ) {
    super(mutualfriendsService, photosService, religiousviewsService, politicalviewsService, 'friend');
  }

  ngOnChanges(values) {
    if (values.user && values.user.currentValue) {
      this.assignUser();
    }
  }


  closeProfile(event) {
    this.closeprofileEvent.next(event);
  }

  openMessages(event) {
    console.log('open messages');
  }


}
