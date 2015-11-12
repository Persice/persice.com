/// <reference path="../../../typings/_custom.d.ts" />

import {Component, Input, Output, EventEmitter} from 'angular2/angular2';
import {ProfileAboutComponent} from '../profileabout/profileabout.component';
import {ProfileFeaturesComponent} from '../profilefeatures/profilefeatures.component';
import {ProfileLikesComponent} from '../profilelikes/profilelikes.component';
import {ProfileMutualsComponent} from '../profilemutuals/profilemutuals.component';
import {MutualFriendsService} from '../../services/mutualfriends.service';

import {ObjectUtil} from '../../core/util';

let view = require('./profile.html');

@Component({
  selector: 'profile',
  template: view,
  directives: [
    ProfileAboutComponent,
    ProfileFeaturesComponent,
    ProfileLikesComponent,
    ProfileMutualsComponent
  ]
})
export class ProfileComponent {
  @Input() user;
  @Input() mutuals;
  @Output() acceptEvent: EventEmitter = new EventEmitter;
  @Output() passEvent: EventEmitter = new EventEmitter;
  @Output() closeprofileEvent: EventEmitter = new EventEmitter;
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
  profileMutuals = {
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
  profileMutualsCount: number = 0;


  constructor(public mutualfriendsService: MutualFriendsService) {
  }

  onInit() {
    this.profileLikes = ObjectUtil.transform(this.user.likes[0]);
    this.profileLikesCount = ObjectUtil.count(this.user.likes[0]);

    this.profileOffers = ObjectUtil.first(this.user.offers[0], 6);
    this.profileInterests = ObjectUtil.first(this.user.interests[0], 6);
    this.profileGoals = ObjectUtil.first(this.user.goals[0], 6);
    this.profileOffersMore = ObjectUtil.skip(this.user.offers[0], 6);
    this.profileInterestsMore = ObjectUtil.skip(this.user.interests[0], 6);
    this.profileGoalsMore = ObjectUtil.skip(this.user.goals[0], 6);
    this.profileInterestsCount = ObjectUtil.count(this.user.interests[0]);
    this.profileOffersCount = ObjectUtil.count(this.user.offers[0]);
    this.profileGoalsCount = ObjectUtil.count(this.user.goals[0]);

    this.getMutualFriends(this.user.id);

  }

  getMutualFriends(id) {
    this.mutualfriendsService.get('', 100, id)
      .subscribe(data => this.assignMutualFriends(data));
  }

  assignMutualFriends(data) {
    if (data.meta.total_count > 0) {
      let items = data.objects[0];
      this.profileMutualsCount += parseInt(items.mutual_bk_friends_count, 10);
      this.profileMutualsCount += parseInt(items.mutual_fb_friends_count, 10);
      this.profileMutualsCount += parseInt(items.mutual_linkedin_connections_count, 10);
      this.profileMutualsCount += parseInt(items.mutual_twitter_followers_count, 10);
      this.profileMutualsCount += parseInt(items.mutual_twitter_friends_count, 10);

      this.profileMutuals.mutual_bk_friends = items.mutual_bk_friends;
      this.profileMutuals.mutual_fb_friends = items.mutual_fb_friends;
      this.profileMutuals.mutual_linkedin_connections = items.mutual_linkedin_connections;
      this.profileMutuals.mutual_twitter_friends = items.mutual_twitter_friends;
      this.profileMutuals.mutual_twitter_followers = items.mutual_twitter_followers;
    }
  }

  passUser(event) {
    this.passEvent.next(true);
  }

  acceptUser(event) {
    this.acceptEvent.next(true);
  }

  closeProfile(event) {
    this.closeprofileEvent.next(event);
  }


}

