import {Input} from 'angular2/core';

import {UserProfileService} from '../../services/userprofile.service';

import {ObjectUtil} from '../../core/util';

export abstract class BaseProfileComponent {
  @Input() user;
  profileId;
  profileType: string = '';
  profileAge = '';
  profileGender = '';
  profileLocation = '';
  profileScore = '';
  profileName = '';
  profileJob = '';
  profileReligiousViews = [];
  profilePoliticalViews = [];
  profileActiveAgo = '2h ago';
  profileDistance = '';
  profileAbout: string = '';
  profileAvatar: string = '';
  profilePhotos: any[] = [];
  profilePhotosCount: number = 0;
  profileKeywords: any[] = [];
  profileKeywordsCount: number = 0;
  profileInterests: any[] = [];
  profileGoals: any[] = [];
  profileOffers: any[] = [];
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
  profileNetworks = {
    facebook: '',
    twitter: '',
    linkedin: ''
  };
  loading: boolean = true;
  serviceInstance;
  serviceInstanceRefresh;
  userEdit;

  profileReligiousIndex = [];
  profilePoliticalIndex = [];

  constructor(
    public userProfileService: UserProfileService,
    public type: string
  ) {
    this.profileType = type;
  }

  assignUser() {
    this.loading = true;

    if (this.type === 'friend' || this.type === 'crowd') {

      this.profileId = this.user.id;
      this.profileName = this.user.first_name;
      this.profileAge = this.user.age;
      this.profileGender = this.user.gender === 'm' ? 'Male' : 'Female';
      this.profileDistance = `${this.user.distance[0]} ${this.user.distance[1]}`;
      this.profileLocation = this.user.lives_in ? this.user.lives_in : '';

      let likes = this.user.likes[0];
      this.profileLikes = Object.keys(likes).map((key) => {
        return {
          value: key,
          match: likes[key]
        };
      });

      this.profileJob = this.user.position && this.user.position.job !== null && this.user.position.company !== null ? `${this.user.position.job} at ${this.user.position.company}` : '';

      this.profileLikesCount = this.profileLikes.length;

      this.profileAvatar = this.user.image;
      this.profileAbout = this.user.about;
      this.profileScore = this.user.score;

      this.profileNetworks.facebook = `https://www.facebook.com/app_scoped_user_id/${this.user.facebook_id}`;
      this.profileNetworks.linkedin = this.user.linkedin_provider && this.user.linkedin_provider !== null ? this.user.linkedin_provider : '';
      this.profileNetworks.twitter = this.user.twitter_provider && this.user.twitter_provider !== null ? `https://twitter.com/${this.user.twitter_username}` : '';

      this.profileOffers = ObjectUtil.transformSorted(this.user.offers[0]);
      this.profileInterests = ObjectUtil.transformSorted(this.user.interests[0]);
      this.profileGoals = ObjectUtil.transformSorted(this.user.goals[0]);
      this.profileInterestsCount = ObjectUtil.count(this.user.interests[0]);
      this.profileOffersCount = ObjectUtil.count(this.user.offers[0]);
      this.profileGoalsCount = ObjectUtil.count(this.user.goals[0]);

      this.profileKeywords = this.user.keywords ? this.user.keywords : [];
      this.profileKeywordsCount = this.user.keywords ? this.user.keywords.length : 0;


      this.serviceInstance = this.userProfileService.getFriendProfile(this.user.id)
        .subscribe((res) => {
          this.profilePhotos = [];
          this.profilePhotosCount = 0;
          setTimeout(() => {
            this.profilePhotos = res.photos;
            this.profilePhotosCount = res.photos_count;
            this.profileFriends = res.friends;
            this.profileFriendsCount = res.friends_count;
            this.profilePoliticalViews = res.political;
            this.profileReligiousViews = res.religious;
            this.loading = false;
          });

        });
    } else if (this.type === 'my') {

      this.serviceInstance = this.userProfileService.getMyProfile()
        .subscribe((res: any) => {
          this.user = res.user;
          this.userEdit = this.user;

          this.profileId = res.id;
          this.profileName = res.name;
          this.profileAge = res.age;
          this.profileGender = res.gender;
          this.profileDistance = '';
          this.profileLocation = res.location;
          this.profileJob = res.job;
          this.userEdit.profession = res.job;

          this.profileAvatar = res.avatar;
          this.profileAbout = res.about;
          this.profileScore = '';

          this.profileNetworks = res.networks;
          this.profileOffers = res.offers;
          this.profileInterests = res.interests;
          this.profileGoals = res.goals;
          this.profileInterestsCount = res.interests_count;
          this.profileOffersCount = res.offers_count;
          this.profileGoalsCount = res.goals_count;

          this.profileLikes = res.likes;
          this.profileLikesCount = res.likes_count;
          this.profileFriends = res.friends;
          this.profileFriendsCount = res.friends_count;
          this.profilePoliticalViews = res.political;
          this.profileReligiousViews = res.religious;
          this.profileReligiousIndex = res.religious_index;
          this.profilePoliticalIndex = res.political_index;

          this.profilePhotos = [];
          this.profilePhotosCount = 0;

          setTimeout(() => {
            this.profilePhotos = res.photos;
            this.profilePhotosCount = res.photos_count;
            this.loading = false;
          });



        });
    }



  }

  refreshUser(event) {
    this.profileInterests = [];
    this.profileGoals = [];
    this.profileOffers = [];
    this.profileInterestsCount = 0;
    this.profileGoalsCount = 0;
    this.profileOffersCount = 0;
    this.loading = true;
    this.serviceInstanceRefresh = this.userProfileService.getMyProfileUpdates()
      .subscribe((res: any) => {
        this.user = res.user;
        this.userEdit = res.user;
        this.userEdit.profession = res.job;
        this.profileAbout = res.about;

        this.profileNetworks = res.networks;
        this.profileOffers = res.offers;
        this.profileInterests = res.interests;
        this.profileGoals = res.goals;
        this.profileInterestsCount = res.interests_count;
        this.profileOffersCount = res.offers_count;
        this.profileGoalsCount = res.goals_count;

        this.profilePoliticalViews = res.political;
        this.profileReligiousViews = res.religious;
        this.profileReligiousIndex = res.religious_index;
        this.profilePoliticalIndex = res.political_index;

        this.profilePhotos = [];
        this.profilePhotosCount = 0;

        setTimeout(() => {
          this.profilePhotos = res.photos;
          this.profilePhotosCount = res.photos_count;
          this.loading = false;
        });
      });


  }

  unsubscribe() {
    if (this.serviceInstance) {
      this.loading = false;
      this.serviceInstance.unsubscribe();
    }
  }

  unsubscribeRefresh() {
    if (this.serviceInstanceRefresh) {
      this.loading = false;
      this.serviceInstanceRefresh.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.unsubscribe();
    this.unsubscribeRefresh();
  }



}
