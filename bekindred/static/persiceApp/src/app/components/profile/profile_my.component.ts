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

/** Services */
import {MutualFriendsService} from '../../services/mutualfriends.service';
import {PhotosService} from '../../services/photos.service';
import {UserAuthService} from '../../services/userauth.service';
import {ConnectionsService} from '../../services/connections.service';

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
    ProfileItemsComponent
  ],
  providers: [
    ConnectionsService,
    UserAuthService,
    PhotosService
  ]
})
export class ProfileMyComponent extends BaseProfileComponent {
  user;
  friendsTitle: string = 'Connections';

  constructor(
    public mutualfriendsService: MutualFriendsService,
    public connectionsService: ConnectionsService,
    public photosService: PhotosService,
    public userService: UserAuthService
    ) {
    super(mutualfriendsService, photosService, 'my');
  }

  ngOnInit() {
    this.getMyProfile();
  }

  getMyProfile() {
    this.userService.findOneByUri('me')
      .subscribe((data) => this.assignData(data));
  }

  assignData(data) {

    this.profileId = data.id;
    this.profileName = data.first_name;
    this.profileAge = data.age;
    this.profileGender = data.gender === 'm' ? 'Male' : 'Female';
    this.profileDistance = `${data.distance[0]} ${data.distance[1]}`;

    this.profileLikes = [];
    this.profileLikesCount = this.profileLikes.length;

    this.profileJob = data.position && data.position.job !== null && data.position.company !== null ? `${data.position.job} at ${data.position.company}` : '';


    this.profileAvatar = data.image;
    this.profileAbout = data.about_me;
    this.profileScore = '';

    this.profileNetworks.facebook = `https://www.facebook.com/app_scoped_user_id/${data.facebook_id}`;
    this.profileNetworks.linkedin = data.linkedin_provider && data.linkedin_provider !== null ? data.linkedin_provider : '';
    this.profileNetworks.twitter = data.twitter_provider && data.twitter_provider !== null ? `https://twitter.com/${data.twitter_username}` : '';

    this.profileOffers = this.transformData(data.offers, 'subject');
    this.profileInterests = this.transformData(data.interests, 'interest_subject');
    this.profileGoals = this.transformData(data.goals, 'subject');
    this.profileInterestsCount = data.interests.length;
    this.profileOffersCount = data.offers.length;
    this.profileGoalsCount = data.goals.length;

    this.getConnections();
    this.getPhotos(data.id);
  }

  transformData(arr, prop) {
    let res = [];

    for (let i = 0; i < arr.length; i++) {
      res.push({
        value: arr[i][prop],
        match: 0
      });
    }
    return res;
  }

  getConnections() {
    this.connectionsService.get('', 100, false)
      .subscribe((data) => this.assignConnections(data));
  }

  assignConnections(data) {
    if (data.meta.total_count > 0) {
      let items = data.objects;
      this.profileFriendsCount = items.length;
      this.profileFriends.mutual_bk_friends = items;
    }
  }

  closeProfile(event) {
    window.history.back();
  }

  openEditProfile(event) {
    console.log('edit profile');
  }


}
