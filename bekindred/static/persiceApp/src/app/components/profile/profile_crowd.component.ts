import {Component, Input, Output, EventEmitter} from 'angular2/core';

/** Base Class */
import {BaseProfileComponent} from './base_profile.component';

/** Components */
import {ProfileAvatarComponent} from '../profile_avatar/profile_avatar.component';
import {ProfileAboutComponent} from '../profile_about/profile_about.component';
import {ProfileLikesComponent} from '../profile_likes/profile_likes.component';
import {ProfileFriendsComponent} from '../profile_friends/profile_friends.component';
import {ProfileNetworksComponent} from '../profile_networks/profile_networks.component';
import {ProfileItemsComponent} from '../profile_items/profile_items.component';

import {ProfileAcceptPassComponent} from '../profile_acceptpass/profile_acceptpass.component';

/** Services */
import {MutualFriendsService} from '../../services/mutualfriends.service';
import {PhotosService} from '../../services/photos.service';

/** Utils */
import {ObjectUtil} from '../../core/util';

/** View */
let view = require('./profile.html');

@Component({
  selector: 'profile-crowd',
  template: view,
  directives: [
    ProfileAvatarComponent,
    ProfileAboutComponent,
    ProfileLikesComponent,
    ProfileFriendsComponent,
    ProfileAcceptPassComponent,
    ProfileNetworksComponent,
    ProfileItemsComponent
  ],
  providers: [
    PhotosService
  ]
})
export class ProfileCrowdComponent extends BaseProfileComponent {
  @Input() user;
  @Input() type;
  @Output() acceptEvent: EventEmitter<any> = new EventEmitter;
  @Output() passEvent: EventEmitter<any> = new EventEmitter;
  @Output() closeprofileEvent: EventEmitter<any> = new EventEmitter;
  friendsTitle: string = 'Mutual Connections';

  constructor(
    public mutualfriendsService: MutualFriendsService,
    public photosService: PhotosService
    ) {
    super(mutualfriendsService, photosService, 'crowd');
  }

  passUser(event) {
    this.passEvent.next(event);
  }

  acceptUser(event) {
    this.acceptEvent.next(event);
  }

  closeProfile(event) {
    this.closeprofileEvent.next(event);
  }


}
