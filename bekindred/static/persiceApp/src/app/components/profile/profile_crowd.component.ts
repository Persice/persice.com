import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/core';

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
import {MutualFriendsService} from '../../services/mutualfriends.service';
import {PhotosService} from '../../services/photos.service';
import {ReligiousViewsService} from '../../services/religiousviews.service';
import {PoliticalViewsService} from '../../services/politicalviews.service';

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
    ProfileItemsComponent,
    LoadingComponent
  ],
  providers: [
    PhotosService
  ]
})
export class ProfileCrowdComponent {
  @Input() user;
  @Input() count;
  @Input() currentIndex;
  @Output() acceptEvent: EventEmitter<any> = new EventEmitter;
  @Output() passEvent: EventEmitter<any> = new EventEmitter;
  @Output() closeprofileEvent: EventEmitter<any> = new EventEmitter;
  @Output() nextEvent: EventEmitter<any> = new EventEmitter;
  @Output() previousEvent: EventEmitter<any> = new EventEmitter;
  friendsTitle: string = 'Mutual Connections';

  profileId;
  profileType: string = 'crowd';
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
    public photosService: PhotosService,
    public religiousviewsService: ReligiousViewsService,
    public politicalviewsService: PoliticalViewsService
  ) {

  }

  ngOnChanges(values) {
    if (values.user && values.user.currentValue) {
      this.assignUser();
    }
  }

  assignUser() {
    this.loadingConnections = true;
    this.loadingPhotos = true;
    this.loadingLikes = true;

    this.profileId = this.user.id;
    this.profileName = this.user.first_name;
    this.profileAge = this.user.age;
    this.profileGender = this.user.gender === 'm' ? 'Male' : 'Female';
    this.profileDistance = `${this.user.distance[0]} ${this.user.distance[1]}`;
    this.profileLocation = this.user.lives_in ? this.user.lives_in : '';


    setTimeout(() => {
      this.profileLikesCount = 0;
      this.profileLikes = [];
      let likes = this.user.likes;
      this.profileLikes = likes;
      this.profileLikesCount = this.profileLikes.length;
      this.loadingLikes = false;

    });

    this.profileJob = this.user.position && this.user.position.job !== null && this.user.position.company !== null ? `${this.user.position.job} at ${this.user.position.company}` : '';

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

    this.getMutualFriends(this.user.id);
    this.getPhotos(this.user.id);
    this.getReligiousViews(this.user.id);
    this.getPoliticalViews(this.user.id);
  }

  getMutualFriends(id) {
    this.mutualfriendsService.get('', 100, id)
      .subscribe(data => this.assignMutualFriends(data));
  }

  getReligiousViews(id) {
    this.religiousviewsService.getByUser('', 100, id)
      .subscribe(data => this.assignReligiousViews(data));
  }

  getPoliticalViews(id) {
    this.politicalviewsService.getByUser('', 100, id)
      .subscribe(
      data => this.assignPoliticalViews(data),
      (err) => console.log('Error fetching political views'),
      () => { }
      );
  }

  getPhotos(id) {
    this.photosService.get('', 6, id)
      .subscribe(data => this.assignPhotos(data));
  }

  assignPhotos(data) {
    this.profilePhotosCount = 0;
    this.profilePhotos = [];
    setTimeout(() => {
      if (data.meta.total_count > 0) {
        this.profilePhotos = data.objects.reverse();
        this.profilePhotosCount = this.profilePhotos.length;
      }
      this.loadingPhotos = false;
    });

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

  assignReligiousViews(data) {
    if (data.meta.total_count > 0) {
      let items = data.objects;
      this.profileReligiousViews = items;
    }
  }

  assignPoliticalViews(data) {
    if (data.meta.total_count > 0) {
      let items = data.objects;
      this.profilePoliticalViews = items;
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
