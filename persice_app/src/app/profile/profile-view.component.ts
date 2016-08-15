import { Component, OnInit, OnDestroy } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Http } from '@angular/http';
import { AvatarComponent } from './avatar.component';
import { AboutComponent } from './about.component';
import { LikesComponent } from './likes.component';
import { FriendsComponent } from './friends.component';
import { NetworksComponent } from './networks.component';
import { ItemsComponent } from './items.component';
import { AcceptPassComponent } from './acceptpass.component';
import { GalleryComponent } from './gallery.component';
import { LoadingComponent } from '../shared/components/loading';
import {
  ProfileService,
  MutualFriendsService,
  FriendService,
  PhotosService,
  ConnectionsCounterService
} from '../shared/services';
import { DropdownDirective, RemodalDirective } from '../shared/directives';
import { ObjectUtil, ListUtil } from '../shared/core';


@Component({
  selector: 'prs-profile-view',
  template: <any>require('./profile.html'),
  directives: [
    AvatarComponent,
    AboutComponent,
    LikesComponent,
    FriendsComponent,
    NetworksComponent,
    ItemsComponent,
    AcceptPassComponent,
    LoadingComponent,
    DropdownDirective,
    GalleryComponent,
    RemodalDirective,
    ROUTER_DIRECTIVES
  ],
  providers: [
    ProfileService,
    MutualFriendsService,
    FriendService,
    PhotosService
  ]
})
export class ProfileViewComponent implements OnInit, OnDestroy {
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
    private profileService: ProfileService,
    private friendService: FriendService,
    private photosService: PhotosService,
    private http: Http,
    private counterService: ConnectionsCounterService
  ) {

  }

  setUsername(username) {
    this.username = username;
  }


  ngOnInit() {

    //listen for event when gallery modal is closed
    jQuery(document).on('closed', '.remodal', (e) => {
      this.galleryActive = false;
    });


    setTimeout(() => {
      window.scrollTo(0, 0);
    });

    this.profileServiceInstance = this.profileService.serviceObserver()
      .subscribe((res) => {
        this.user = res.data;
        this.notFound = res.notFound;
        this.loading = res.loading;
        if (Object.keys(res.data).length > 0) {
          this.assignData(this.user);
          setTimeout(() => {
            jQuery('#userprofile').focus();
            window.scrollTo(0, 0);
          });
        }

      });

    this.profileService.loadProfile(this.username);
  }

  assignData(data) {
    this.loadingConnections = true;
    this.loadingLikes = true;
    this.loadingPhotos = true;

    this.profileType = data.connected === true ? 'friend' : 'crowd';

    if (this.profileType === 'friend') {
      if (data.updated_at === null) {
        let url = `/api/v2/new_connections/updated_at/?format=json&friend_id=${data.id}`;
        this.http.get(url).map(res => res.json()).subscribe(data => {
          this.counterService.refreshCounter();
        });
      }
    }

    this.profileId = data.id;
    this.profileName = data.first_name;
    this.profileAge = data.age;
    this.profileGender = data.gender === 'm' ? 'Male' : 'Female';
    this.profileDistance = `${data.distance[0]} ${data.distance[1]}`;
    this.profileLocation = data.lives_in ? data.lives_in : '';


    setTimeout(() => {
      this.profileLikesCount = 0;
      this.profileLikes = [];
      let likes = data.likes ? data.likes : [];
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


    let religious_views = [];
    for (var i = 0; i < data.religious_views.length; ++i) {
      religious_views = [...religious_views, {
        religious_view: data.religious_views[i]
      }];
    }
    this.profileReligiousViews = religious_views;


    let political_views = [];
    for (var i = 0; i < data.political_views.length; ++i) {
      political_views = [...political_views, {
        political_view: data.political_views[i]
      }];
    }
    this.profilePoliticalViews = political_views;


    this.getMutualFriends(data.id);
    this.getPhotos(data.id);
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
        this.profilePhotos = ListUtil.orderBy(data.objects, ['order'], ['asc']);
        this.profilePhotosCount = this.profilePhotos.length;
      }
      this.loadingPhotos = false;
    });

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
    window.history.back(-1);
  }

  acceptUser(event) {
    this.friendService.saveFriendship(0, event.user)
      .subscribe(data => {
        this.closeProfile(true);
      });

  }

  passUser(event) {
    this.friendService.saveFriendship(-1, event.user)
      .subscribe(data => {
        this.closeProfile(true);
      });

  }


  ngOnDestroy() {
    if (this.profileServiceInstance) {
      this.profileServiceInstance.unsubscribe();
    }

    jQuery(document).off('closed', '.remodal');

  }

  eventHandler(key) {
    switch (key) {
      case 27: //escape
        this.closeProfile(true);
        break;
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
