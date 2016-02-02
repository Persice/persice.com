import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/core';
import {RouteParams} from 'angular2/router';

/** Components */
import {ProfileAvatarComponent} from '../profile_avatar/profile_avatar.component';
import {ProfileAboutComponent} from '../profile_about/profile_about.component';
import {ProfileLikesComponent} from '../profile_likes/profile_likes.component';
import {ProfileFriendsComponent} from '../profile_friends/profile_friends.component';
import {ProfileNetworksComponent} from '../profile_networks/profile_networks.component';
import {ProfileItemsComponent} from '../profile_items/profile_items.component';
import {LoadingComponent} from '../loading/loading.component';
import {ProfileAcceptPassComponent} from '../profile_acceptpass/profile_acceptpass.component';

/** Services */
import {ProfileService} from '../../services/profile.service';
import {MutualFriendsService} from '../../services/mutualfriends.service';
import {PhotosService} from '../../services/photos.service';
import {ReligiousViewsService} from '../../services/religiousviews.service';
import {PoliticalViewsService} from '../../services/politicalviews.service';

/**
 * Directives
 */
import {DropdownDirective} from '../../directives/dropdown.directive';


/** Utils */
import {ObjectUtil, ListUtil} from '../../core/util';

/** View */
let view = require('./profile.html');

@Component({
  selector: 'profile-view',
  template: view,
  directives: [
    ProfileAvatarComponent,
    ProfileAboutComponent,
    ProfileLikesComponent,
    ProfileFriendsComponent,
    ProfileAcceptPassComponent,
    ProfileNetworksComponent,
    ProfileItemsComponent,
    LoadingComponent,
    DropdownDirective
  ],
  providers: [
    PhotosService,
    ProfileService
  ]
})
export class ProfileViewComponent {
  user;
  username;
  count = 0;
  friendsTitle: string = 'Mutual Connections';
  profileServiceInstance;
  notFound: boolean = false;

  profileId;
  profileType: string = 'friend';
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
  loading: boolean = false;
  loadingLikes: boolean = false;
  loadingConnections: boolean = false;
  loadingPhotos: boolean = false;


  constructor(
    public mutualfriendsService: MutualFriendsService,
    private profileService: ProfileService,
    private _params: RouteParams
  ) {
    this.username = this._params.get('username');
    console.log('Viewing profile for user', this.username);
  }


  ngOnInit() {

    this.profileServiceInstance = this.profileService.serviceObserver()
      .subscribe((res) => {
        this.user = res.data;
        this.notFound = res.notFound;
        this.loading = res.loading;
        if (Object.keys(res.data).length > 0) {
          this.assignData(this.user);
        }

      });

    this.profileService.loadProfile('http://localhost:1337/people/58');
  }

  assignData(data) {
    this.loadingConnections = true;
    this.loadingLikes = true;
    this.loadingPhotos = true;

    this.profileType = data.connection ? 'friend' : 'crowd';

    this.profileId = data.id;
    this.profileName = data.first_name;
    this.profileAge = data.age;
    this.profileGender = data.gender === 'm' ? 'Male' : 'Female';
    this.profileDistance = `${data.distance[0]} ${data.distance[1]}`;
    this.profileLocation = data.lives_in ? data.lives_in : '';


    setTimeout(() => {
      this.profileLikesCount = 0;
      this.profileLikes = [];
      let likes = data.likes;
      this.profileLikes = likes;
      this.profileLikesCount = this.profileLikes.length;
      this.loadingLikes = false;

    });

    this.profileJob = data.position && data.position.job !== null && data.position.company !== null ? `${data.position.job} at ${data.position.company}` : '';

    this.profileAvatar = data.image;
    this.profileAbout = data.about;
    this.profileScore = data.score;

    this.profileNetworks.facebook = `https://www.facebook.com/app_scoped_user_id/${data.facebook_id}`;
    this.profileNetworks.linkedin = data.linkedin_provider && data.linkedin_provider !== null ? data.linkedin_provider : '';
    this.profileNetworks.twitter = data.twitter_provider && data.twitter_provider !== null ? `https://twitter.com/${data.twitter_username}` : '';

    this.profileOffers = ObjectUtil.transformSorted(data.offers[0]);
    this.profileInterests = ObjectUtil.transformSorted(data.interests[0]);
    this.profileGoals = ObjectUtil.transformSorted(data.goals[0]);
    this.profileInterestsCount = ObjectUtil.count(data.interests[0]);
    this.profileOffersCount = ObjectUtil.count(data.offers[0]);
    this.profileGoalsCount = ObjectUtil.count(data.goals[0]);


    this.profileReligiousViews = data.religious_views;
    this.profilePoliticalViews = data.political_views;


    this.profilePhotosCount = 0;
    this.profilePhotos = [];

    setTimeout(() => {
      this.profilePhotos = ListUtil.orderBy(data.photos, ['order'], ['asc']);
      this.profilePhotosCount = this.profilePhotos.length;
      this.loadingPhotos = false;
    });

    this.getMutualFriends(data.id);
  }

  getMutualFriends(id) {
    this.mutualfriendsService.get('', 100, id)
      .subscribe((data) => this.assignMutualFriends(data));
  }

  assignMutualFriends(data) {
    this.profileFriendsCount = 0;
    this.profileFriends.mutual_bk_friends = [];
    this.profileFriends.mutual_fb_friends = [];
    this.profileFriends.mutual_linkedin_connections = [];
    this.profileFriends.mutual_twitter_friends = [];
    this.profileFriends.mutual_twitter_followers = [];
    setTimeout(() => {
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
        this.loadingConnections = false;
      }
    });
  }


  closeProfile(event) {
    window.history.back();
  }

  acceptUser(event) {
    console.log('accept user');
  }

  passUser(event) {
    console.log('pass user');
  }

  ngOnDestroy() {
    if (this.profileServiceInstance) {
      this.profileServiceInstance.unsubscribe();
    }
  }

}
