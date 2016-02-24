import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {Http} from 'angular2/http';

/** Components */
import {ProfileAvatarComponent} from '../profile_avatar/profile_avatar.component';
import {ProfileAboutComponent} from '../profile_about/profile_about.component';
import {ProfileLikesComponent} from '../profile_likes/profile_likes.component';
import {ProfileFriendsComponent} from '../profile_friends/profile_friends.component';
import {ProfileNetworksComponent} from '../profile_networks/profile_networks.component';
import {ProfileItemsComponent} from '../profile_items/profile_items.component';
import {LoadingComponent} from '../loading/loading.component';
import {ProfileGalleryComponent} from '../profile_gallery/profile_gallery.component';

/** Directives */
import {DropdownDirective} from '../../directives/dropdown.directive';
import {RemodalDirective} from '../../directives/remodal.directive';

/** Services */
import {MutualFriendsService} from '../../services/mutualfriends.service';
import {PhotosService} from '../../services/photos.service';
import {ReligiousViewsService} from '../../services/religiousviews.service';
import {PoliticalViewsService} from '../../services/politicalviews.service';
import {ConnectionsCounterService} from '../../services/connections_counter.service';
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
    LoadingComponent,
    ProfileGalleryComponent,
    RemodalDirective,
    ROUTER_DIRECTIVES
  ],
  providers: [
    PhotosService,
    ReligiousViewsService
  ]
})
export class ProfileFriendComponent {
  @Input() user;
  @Input() count;
  @Input() currentIndex;
  @Output() closeprofileEvent: EventEmitter<any> = new EventEmitter;
  @Output() nextEvent: EventEmitter<any> = new EventEmitter;
  @Output() previousEvent: EventEmitter<any> = new EventEmitter;
  friendsTitle: string = 'Mutual Connections';

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
  galleryActive = false;
  galleryOptions = JSON.stringify({
    hashTracking: false,
    closeOnOutsideClick: true
  });

  constructor(
    private mutualfriendsService: MutualFriendsService,
    private photosService: PhotosService,
    private religiousviewsService: ReligiousViewsService,
    private politicalviewsService: PoliticalViewsService,
    private counterService: ConnectionsCounterService,
    private http: Http
  ) {

  }

  ngOnDestroy() {
    jQuery(document).off('closed', '.remodal');
  }

  ngOnInit() {

    //listen for event when gallery modal is closed
    jQuery(document).on('closed', '.remodal', (e) => {
      this.galleryActive = false;
    });



    setTimeout(() => {
      jQuery('#userprofile').focus();
      window.scrollTo(0, 0);
    });
  }

  ngOnChanges(values) {
    if (values.user && values.user.currentValue) {
      this.assignUser();
    }
  }

  assignUser() {
    this.galleryActive = false;
    this.loadingConnections = true;
    this.loadingPhotos = true;
    this.loadingLikes = true;

    if (this.user.updated_at === null) {
      let url = `/api/v1/new_connections/updated_at/?format=json&friend_id=${this.user.id}`;
      this.http.get(url).map(res => res.json()).subscribe(data => {
        this.counterService.refreshCounter();
      });
    }


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


  closeProfile(event) {
    this.closeprofileEvent.next(event);
  }

  openMessages(event) {
    console.log('open messages');
  }

  eventHandler(key) {
    switch (key) {
      case 27: //escape
        this.closeProfile(true);
        break;
      case 37: //left
        this.previousEvent.next(true);
        break;
      case 39: //right
        this.nextEvent.next(true);
      default:
        break;
    }
  }

  openGallery(event) {
    let remodal = jQuery('[data-remodal-id=modal-gallery]').remodal();
    remodal.open();
    this.galleryActive = true;
  }


}
