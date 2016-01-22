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

import {ProfileAcceptPassComponent} from '../profile_acceptpass/profile_acceptpass.component';

/** Services */
import {UserProfileService} from '../../services/userprofile.service';

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
    UserProfileService
  ]
})
export class ProfileCrowdComponent extends BaseProfileComponent {
  @Input() user;
  @Input() type;
  @Input() count;
  @Output() acceptEvent: EventEmitter<any> = new EventEmitter;
  @Output() passEvent: EventEmitter<any> = new EventEmitter;
  @Output() closeprofileEvent: EventEmitter<any> = new EventEmitter;
  @Output() nextEvent: EventEmitter<any> = new EventEmitter;
  @Output() previousEvent: EventEmitter<any> = new EventEmitter;
  friendsTitle: string = 'Mutual Connections';

  constructor(
    public userProfileService: UserProfileService
  ) {
    super(userProfileService, 'crowd');
  }

  ngOnChanges(values) {
    if (values.user && values.user.currentValue) {
      this.assignUser();
    }
  }

  passUser(event) {
    this.unsubscribe();
    this.passEvent.next(event);
  }

  acceptUser(event) {
    this.unsubscribe();
    this.acceptEvent.next(event);
  }

  nextProfile(event) {
    this.unsubscribe();
    this.nextEvent.next(event);
  }

  previousProfile(event) {
    this.unsubscribe();
    this.previousEvent.next(event);
  }

  closeProfile(event) {
    this.unsubscribe();
    this.closeprofileEvent.next(event);
  }


}
