import {Component, Input, Output, EventEmitter} from 'angular2/core';

import {ProfileAvatarComponent} from '../profile_avatar/profile_avatar.component';

import {ProfileAboutComponent} from '../profile_about/profile_about.component';
import {ProfileFeaturesComponent} from '../profilefeatures/profilefeatures.component';
import {ProfileLikesComponent} from '../profile_likes/profile_likes.component';
import {ProfileFriendsComponent} from '../profile_friends/profile_friends.component';

import {MutualFriendsService} from '../../services/mutualfriends.service';
import {PhotosService} from '../../services/photos.service';

import {ObjectUtil} from '../../core/util';

let view = require('./profile.html');

@Component({
  selector: 'profile',
  template: view,
  directives: [
    ProfileAvatarComponent,
    ProfileAboutComponent,
    ProfileFeaturesComponent,
    ProfileLikesComponent,
    ProfileFriendsComponent
  ],
  providers: [
    PhotosService
  ]
})
export class ProfileComponent {
  @Input() user;
  @Output() acceptEvent: EventEmitter<any> = new EventEmitter;
  @Output() passEvent: EventEmitter<any> = new EventEmitter;
  @Output() closeprofileEvent: EventEmitter<any> = new EventEmitter;
  profileScore = '';
  profileAbout: string = '';
  profileAvatar: string = '';
  profilePhotos: any[] = [];
  profilePhotosCount: number = 0;
  profileKeywords: any[] = [];
  profileKeywordsCount: number = 0;
  profileInterests: any[] = [];
  profileInterestsMore: any[] = [];
  profileGoals: any[] = [];
  profileGoalsMore: any[] = [];
  profileOffers: any[] = [];
  profileOffersMore: any[] = [];
  profileInterestsCount: number = 0;
  profileGoalsCount: number = 0;
  profileOffersCount: number = 0;
  profileLikes: any[] = [];
  profileLikesCount: number = 0;
  profileFriends = {
    mutual_bk_friends: [],
    mutual_bk_friends_count: 0,
    mutual_fb_friends: [],
    mutual_fb_friends_count: 0,
    mutual_linkedin_connections: [],
    mutual_linkedin_connections_count: 0,
    mutual_twitter_followers: [],
    mutual_twitter_followers_count: 0,
    mutual_twitter_friends: [],
    mutual_twitter_friends_count: 0
  };
  profileFriendsCount: number = 0;


  constructor(
    public mutualfriendsService: MutualFriendsService,
    public photosService: PhotosService
    ) {
  }

  ngOnInit() {
    this.assignUser();
  }

  ngOnChanges(values) {
    // if (values.user.currentValue !== null) {
    //   this.assignUser();
    // }
  }

  assignUser() {
    let likes = this.user.likes[0];
    this.profileLikes = Object.keys(likes).map((key) => {
      return {
      value: key,
      match: likes[key]
      };
    });

    this.profileLikesCount = this.profileLikes.length;

    this.profileAvatar = this.user.image;
    this.profileAbout = this.user.about;
    this.profileScore = this.user.score;

    this.profileOffers = ObjectUtil.first(this.user.offers[0], 6);
    this.profileInterests = ObjectUtil.first(this.user.interests[0], 6);
    this.profileGoals = ObjectUtil.first(this.user.goals[0], 6);
    this.profileOffersMore = ObjectUtil.skip(this.user.offers[0], 6);
    this.profileInterestsMore = ObjectUtil.skip(this.user.interests[0], 6);
    this.profileGoalsMore = ObjectUtil.skip(this.user.goals[0], 6);
    this.profileInterestsCount = ObjectUtil.count(this.user.interests[0]);
    this.profileOffersCount = ObjectUtil.count(this.user.offers[0]);
    this.profileGoalsCount = ObjectUtil.count(this.user.goals[0]);

    this.profileKeywords = this.user.keywords;
    this.profileKeywordsCount = this.user.keywords.length;

    this.getMutualFriends(this.user.id);
    this.getPhotos(this.user.id);
  }

  getMutualFriends(id) {
    this.mutualfriendsService.get('', 100, id)
      .subscribe(data => this.assignMutualFriends(data));
  }

  getPhotos(id) {
    this.photosService.get('', 6, id)
      .subscribe(data => this.assignPhotos(data));
  }

  assignPhotos(data) {
    if (data.meta.total_count > 0) {
      this.profilePhotos = data.objects.reverse();
      this.profilePhotosCount = this.profilePhotos.length;
    }
  }

  assignMutualFriends(data) {
    if (data.meta.total_count > 0) {
      let items = data.objects[0];
      this.profileFriendsCount += parseInt(items.mutual_bk_friends_count, 10);
      this.profileFriendsCount += parseInt(items.mutual_fb_friends_count, 10);
      this.profileFriendsCount += parseInt(items.mutual_linkedin_connections_count, 10);
      this.profileFriendsCount += parseInt(items.mutual_twitter_followers_count, 10);
      this.profileFriendsCount += parseInt(items.mutual_twitter_friends_count, 10);

      this.profileFriends.mutual_bk_friends = items.mutual_bk_friends;
      this.profileFriends.mutual_fb_friends = items.mutual_fb_friends;
      this.profileFriends.mutual_linkedin_connections = items.mutual_linkedin_connections;
      this.profileFriends.mutual_twitter_friends = items.mutual_twitter_friends;
      this.profileFriends.mutual_twitter_followers = items.mutual_twitter_followers;
    }
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
