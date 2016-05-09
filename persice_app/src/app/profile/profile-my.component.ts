import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import {Router} from '@angular/router-deprecated';

import {ListUtil} from '../shared/core/';


import {AvatarComponent} from './avatar.component';
import {AboutComponent} from './about.component';
import {LikesComponent} from './likes.component';
import {FriendsComponent} from './friends.component';
import {NetworksComponent} from './networks.component';
import {ItemsComponent} from './items.component';
import {EditProfileComponent} from '../edit-profile';
import {LoadingComponent} from '../shared/components/loading';
import {RemodalDirective} from '../shared/directives';
import {
  PhotosService,
  UserAuthService,
  ConnectionsService,
  LikesService,
  ReligiousViewsService,
  PoliticalViewsService,
  HistoryService,
  UserService
} from '../shared/services';

@Component({
  selector: 'prs-profile-my',
  template: require('./profile-my.html'),
  directives: [
    AvatarComponent,
    AboutComponent,
    LikesComponent,
    FriendsComponent,
    NetworksComponent,
    ItemsComponent,
    EditProfileComponent,
    RemodalDirective,
    LoadingComponent
  ],
  providers: [
    ConnectionsService,
    UserAuthService,
    PhotosService,
    LikesService,
    ReligiousViewsService,
    PoliticalViewsService
  ]
})
export class ProfileMyComponent implements OnInit, OnDestroy {
  user;
  userEdit;
  friendsTitle: string = 'Connections';

  profileReligiousIndex = [];
  profilePoliticalIndex = [];
  section = 'profile';

  profileId;
  profileType: string = 'my';
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
  active = false;
  photosServiceSubscriberUpdate;
  loadingPhotosAction: boolean = false;


  constructor(
    public connectionsService: ConnectionsService,
    public photosService: PhotosService,
    public userService: UserAuthService,
    public likesService: LikesService,
    public religiousviewsService: ReligiousViewsService,
    public politicalviewsService: PoliticalViewsService,
    private historyService: HistoryService,
    private userMeService: UserService,
    private _router: Router
  ) {

  }

  ngOnInit() {
    setTimeout(() => {
      jQuery('#userprofile').focus();
      window.scrollTo(0, 0);
    });
    this.getMyProfile();
  }

  getMyProfile() {
    this.loadingLikes = true;
    this.loadingPhotos = true;
    this.loadingConnections = true;
    this.userService.findOneByUri('me')
      .subscribe((data) => this.assignData(data));
  }

  assignData(data) {
    this.user = data;
    this.userEdit = data;

    this.profileId = data.id;
    this.profileName = data.first_name;
    this.profileAge = data.age;
    this.profileGender = data.gender === 'm' ? 'Male' : 'Female';
    this.profileDistance = `${data.distance[0]} ${data.distance[1]}`;

    this.profileLocation = data.lives_in ? data.lives_in : '';

    this.profileJob = data.position && data.position.job !== null && data.position.company !== null ? `${data.position.job} at ${data.position.company}` : '';

    this.userEdit.profession = this.profileJob;
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
    this.getLikes();
    this.getPhotos(data.id);
    this.getReligiousViews();
    this.getPoliticalViews();

  }

  getReligiousViews() {
    this.religiousviewsService.my('', 100)
      .mergeMap((data) => {
        if (data.meta.total_count > 0) {
          let items = data.objects;
          this.profileReligiousViews = items;
        }
        return this.religiousviewsService.getIndex('', 100);
      })
      .subscribe((res: any) => {
        if (res.meta.total_count > 0) {
          let itemsIndex = res.objects;
          for (var i = 0; i < itemsIndex.length; ++i) {
            itemsIndex[i].selected = false;
            for (var j = 0; j < this.profileReligiousViews.length; ++j) {
              if (itemsIndex[i].resource_uri === this.profileReligiousViews[j].religious_index) {
                itemsIndex[i].selected = true;
                itemsIndex[i].view_uri = this.profileReligiousViews[j].resource_uri;
              }
            }
          }
          this.profileReligiousIndex = itemsIndex;
        }
      });
  }

  getPoliticalViews() {
    this.politicalviewsService.my('', 100)
      .mergeMap((data) => {
        if (data.meta.total_count > 0) {
          let items = data.objects;
          this.profilePoliticalViews = items;
        }
        return this.politicalviewsService.getIndex('', 100);
      })
      .subscribe((res: any) => {
        if (res.meta.total_count > 0) {
          let itemsIndex = res.objects;
          for (var i = 0; i < itemsIndex.length; ++i) {
            itemsIndex[i].selected = false;
            for (var j = 0; j < this.profilePoliticalViews.length; ++j) {
              if (itemsIndex[i].resource_uri === this.profilePoliticalViews[j].political_index) {
                itemsIndex[i].selected = true;
                itemsIndex[i].view_uri = this.profilePoliticalViews[j].resource_uri;
              }
            }
          }
          this.profilePoliticalIndex = itemsIndex;
        }
      });
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

  transformLikes(arr, prop) {
    let res = [];

    for (let i = 0; i < arr.length; i++) {
      res.push({
        name: arr[i][prop],
        match: 0,
        picture: arr[i].picture
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
    this.loadingConnections = false;
  }

  getLikes() {
    this.likesService.my('', 200)
      .subscribe((data) => this.assignLikes(data));
  }

  assignLikes(data) {
    if (data.meta.total_count > 0) {
      let items = data.objects;
      this.profileLikes = this.transformLikes(items, 'name');
      this.profileLikesCount = items.length;
    }
    this.loadingLikes = false;
  }

  closeProfile(event) {
    let uri = this.historyService.getPrev();
    if (uri !== '') {
      this._router.parent.navigateByUrl(uri);
    } else {
      this._router.parent.navigateByUrl('/');
    }

  }

  openEdit(section) {
    let remodal = jQuery('[data-remodal-id=profile-edit]').remodal();
    remodal.open();
    this.active = true;
    this.section = section;
  }

  refreshUser(event) {
    this.profileInterests = [];
    this.profileGoals = [];
    this.profileOffers = [];
    this.profileInterestsCount = 0;
    this.profileGoalsCount = 0;
    this.profileOffersCount = 0;
    this.active = false;
    this.getMyProfileUpdates();
  }

  getMyProfileUpdates() {
    this.userService.findOneByUri('me')
      .subscribe((data) => this.assignUpdates(data));
    this.refreshPhotos();
  }

  assignUpdates(data) {
    this.user = data;
    this.userEdit = data;
    this.userEdit.profession = data.position && data.position.job !== null && data.position.company !== null ? `${data.position.job} at ${data.position.company}` : '';
    this.profileAbout = data.about_me;

    this.profileOffers = this.transformData(data.offers, 'subject');
    this.profileInterests = this.transformData(data.interests, 'interest_subject');
    this.profileGoals = this.transformData(data.goals, 'subject');
    this.profileInterestsCount = data.interests.length;
    this.profileOffersCount = data.offers.length;
    this.profileGoalsCount = data.goals.length;
    this.getReligiousViews();
    this.getPoliticalViews();
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

  eventHandler(key) {
    switch (key) {
      case 27: //escape
        this.closeProfile(true);
        break;
      default:
        break;
    }
  }

  cropAndSavePhoto(photo) {
    this.loadingPhotos = true;
    this.photosService.save(photo, (res) => {
      this.refreshPhotos();
      if (photo.order === 0) {
        this.userMeService.getProfileUpdates();
      }
    });
  }

  deletePhoto(photo) {
    this.loadingPhotos = true;
    this.photosService.delete(photo.resource_uri, (res) => {
      if (res === -1) {
        this.loadingPhotos = false;
        return;
      }
      this.refreshPhotos();
      // if deleting main profile photo, refresh profile photo in upper right corner
      if (photo.order === 0) {
        this.userMeService.getProfileUpdates();
      }
    });
  }

  refreshPhotos() {
    this.loadingPhotos = true;
    this.getPhotos(this.user.id);
  }

  reorderPhoto(event) {
    this.loadingPhotosAction = true;
    if (this.photosServiceSubscriberUpdate) {
      this.photosServiceSubscriberUpdate.unsubscribe();
    }

    for (var i = 1; i < this.profilePhotos.length; ++i) {
      for (var j = 0; j < event.length; ++j) {
        if (this.profilePhotos[i].id === event[j]) {
          let order = j + 1;
          this.profilePhotos[i].order = order;
        }
      }
    }
    let data = this.profilePhotos.slice(1);

    this.photosServiceSubscriberUpdate = this.photosService.batchUpdateOrder(data)
      .subscribe(data => {
        this.loadingPhotosAction = false;
      }, err => {
        console.log('could not update order of photos ', err);
        this.loadingPhotosAction = false;
      });
  }

  changeProfilePhoto(event) {
    this.loadingPhotos = true;
    let srcIdx = ListUtil.findIndex(this.profilePhotos, { id: event.src });
    let dstIdx = ListUtil.findIndex(this.profilePhotos, { id: event.dst });

    let srcImg = JSON.parse(JSON.stringify(this.profilePhotos[srcIdx]));
    let dstImg = JSON.parse(JSON.stringify(this.profilePhotos[dstIdx]));

    srcImg.order = this.profilePhotos[dstIdx].order;
    dstImg.order = this.profilePhotos[srcIdx].order;

    let profilePhoto;
    let otherPhoto;
    if (srcImg.order === 0) {
      profilePhoto = srcImg;
      otherPhoto = dstImg;
    } else {
      profilePhoto = dstImg;
      otherPhoto = srcImg;
    }

    this.photosService.updateOrder(otherPhoto, otherPhoto.resource_uri, (res) => {
      if (res === -1) {
        this.loadingPhotos = false;
        return;
      }

      this.photosService.updateOrder({ order: 0, resource_uri: profilePhoto.resource_uri },
        profilePhoto.resource_uri, (res) => {
          if (res === -1) {
            this.loadingPhotos = false;
            return;
          }
          this.userMeService.getProfileUpdates();
          this.refreshPhotos();
        });
    });

  }

  ngOnDestroy() {
    if (this.photosServiceSubscriberUpdate) {
      this.photosServiceSubscriberUpdate.unsubscribe();
    }
  }


}
