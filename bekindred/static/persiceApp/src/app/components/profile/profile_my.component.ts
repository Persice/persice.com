import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/core';
import {Router} from 'angular2/router';

import {mergeMap} from 'rxjs/operator/mergeMap';
import {ListUtil} from '../../core/util';

/** Components */
import {ProfileAvatarComponent} from '../profile_avatar/profile_avatar.component';
import {ProfileAboutComponent} from '../profile_about/profile_about.component';
import {ProfileLikesComponent} from '../profile_likes/profile_likes.component';
import {ProfileFriendsComponent} from '../profile_friends/profile_friends.component';
import {ProfileNetworksComponent} from '../profile_networks/profile_networks.component';
import {ProfileItemsComponent} from '../profile_items/profile_items.component';
import {ProfileEditComponent} from '../profile_edit/profile_edit.component';
import {LoadingComponent} from '../loading/loading.component';

/** Services */
import {MutualFriendsService} from '../../services/mutualfriends.service';
import {PhotosService} from '../../services/photos.service';
import {UserAuthService} from '../../services/userauth.service';
import {ConnectionsService} from '../../services/connections.service';
import {LikesService} from '../../services/likes.service';
import {ReligiousViewsService} from '../../services/religiousviews.service';
import {PoliticalViewsService} from '../../services/politicalviews.service';
import {HistoryService} from '../../services/history.service';
import {UserService} from '../../services/user.service';

//** Directives */
import {RemodalDirective} from '../../directives/remodal.directive';

/** Utils */
import {ObjectUtil} from '../../core/util';

/** View */
let view = require('./profile_my.html');
@Component({
  selector: 'profile-my',
  template: view,
  directives: [
    ProfileAvatarComponent,
    ProfileAboutComponent,
    ProfileLikesComponent,
    ProfileFriendsComponent,
    ProfileNetworksComponent,
    ProfileItemsComponent,
    ProfileEditComponent,
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
export class ProfileMyComponent {
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
    }
    else {
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
    let mainPhotoExists = false;
    let mainUrl = '';
    if (photo.order === 0) {
      for (var i = 0; i < this.profilePhotos.length; ++i) {
        if (this.profilePhotos[i].order === 0) {
          mainPhotoExists = true;
          mainUrl = this.profilePhotos[i].resource_uri;
        }
      }

    }

    if (mainPhotoExists) {
      this.photosService.update(photo, mainUrl, (res) => {
        this.refreshPhotos();
        if (photo.order === 0) {
          this.userMeService.getProfileUpdates();
        }
      });
    }
    else {
      this.photosService.save(photo, (res) => {
        this.refreshPhotos();
        if (photo.order === 0) {
          this.userMeService.getProfileUpdates();
        }
      });
    }

  }

  deletePhoto(photo) {
    this.loadingPhotos = true;
    if (photo.order === 0) {
      let defaultPhoto = {
        cropped: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANAAAADQCAIAAAD5xngjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDg1OUFDMzBBRjc4MTFFMzg0RDRCOEE0NEE1QTY1QkEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDg1OUFDMzFBRjc4MTFFMzg0RDRCOEE0NEE1QTY1QkEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowODU5QUMyRUFGNzgxMUUzODRENEI4QTQ0QTVBNjVCQSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowODU5QUMyRkFGNzgxMUUzODRENEI4QTQ0QTVBNjVCQSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvWzjLAAABxBSURBVHja7F1nd9tWtiUaAXZKokgVS5ZbvJI4U/I+vP//A2ZNEsclVpco9k6CBAESnI1zRI1WMm+ek1gUL3DP8qJoSpYB3H33KfcU5fy6HJMiZVWiykcgRQJOigScFCkScFIk4KRIkYCTIgEnRQJOihQJuLWURSDyMfwR0eUj+C2YVFWJxRSVBJ8ogeBzfLhYom1BX3189f3gHX5AigTcZ8FLuQcWvNc0jQAX/I2R5PsBwBQFIFPoZ/ChSj+rLr/L4Ps37f3q10qJLuAYFAojR1ENQ9U0nbGhqnizAGN5nus4zmQyxYvnzXx/Np8vCGegPZ1Ei9+KYRg6XgFUYkH884D2ZjP8kzkjUSIvooAjuARCb4L3hI8FIQM48edzx/O8yWRi2/ZwOB6NhngznbpAD74LrKoEN00z4nE9kbBYUim8JOJxyzRNw9AIXQBx8JN4h1+Ify4xF0XAAV5zErLJFABsPJ4MBqPRyAYmwGqTCVgtEIAMOMEnrusRFvGvfdanbN6BFHUdqAq+gOF0PaC6BEk8DvIzs9lMPp9LpVL4EfyT+dzn3yJFjw69AWrD4ajX67kktj0G2oA5x3Hn8wByAeo8qEIffMSghD6E23CPnwDZBfHW7M55WOpohSAIDRugEPyXy+VKpe2dnd1CYQN4vFOyEnBRARxgg1UfDIb1er3V6gB8wA0Di8G0ZC+V3yw9g9h9fXgfMfR2wU4DYXGOX+g4wbc6nUW12iiXb4rFyvPnT4+OnoL8CPTQzgsJuPALlhnks7W1AdUGzE2nNdedGkacjbql+6l8DnDvvY9R9OQ/OCXMfsOhPRqddbudTqd7eHhQKpVwDarqA/eRdSZCDjhefjK2DPzNcex+fwA1CpBBzdGHX55K716BZeC72x0Mh+/q9caLFy/29va2tzfgXkB5szUpARey8IdikFUP879Wq3748Oni4noyGRuBxB/aolpG9QC7RaVS63b7T57UX79+tbu7Aw0Lr4ViLjDsYsvInwScyGgjF9LAqrfbnfPz85OT80ajBXWGz8khWJEtRbALuAz+7+npRafTf/bs4OXLF9vbm5YVn7MH63MAb/FbxS0BJwDUQBggMFAbXNHLy/LJyWm1WrVtB+tomsajLCfH/4CqVqtp26NWq/Xy5dHTp4eZTBbfhQu7uBWfvYqw+rN6mKDGugkEZlkGbKRyuXJ8fHp5eQ27De6hRvK4njJHmx1ncnV10+8PK5VmsViAes1k0vl83rLMJdSCFya/kCFPDxPa4BskEqauq4PB6PT0/JdfPsFUh/WGZWbdug7RGYCeeazX69m2fXNzY1lWMpnI5fIbG1m8ZjIpPsbQtDhFpD0JuLVDGxbSNOF3mligq6uA2M7OLrvdLr5FkQh1fawiZSm4NopATweDIcWNq8AZNGw6nQLVpdPJYnEbEo8b2DMScOsV9TBNEJve6/XPzs6Pj08qlToWEoQXj+vraYDfhx0LLng6dQA+SlJcgKeLxeKbN9+8ePEMe2kycVRVlYB7XLQFr5SsEfe82c1N5dOnE2hSwI7DbGtFbP8Fdnd/9f055RAEyQTT6ez8/AK3kM/n9vZ2dX0WjtNYsRmOjs2N0Wh0cnIOtNVqDZAECA9oEzGyoKqaGqQExCjNDqw2qVSqp6dnwJxlJcZjOwThElVktAVH5fBA3759/49//PPqqgyeM80gTUjoheFr1zQVNwLr7erqGuTNlkMIGE5UwGE9oEzH48mHD59+/vk91CitkIHX0PjduBf86Xb719fl4XAI/IUgRKKKyQFBcGE69c7OLj5+PB4OR5ySFrIAPd+m53n1eqPZbODmQuA3qGJu/eCoqNPpwKzu9/ucCBkLo/AWgusK89S2J9hUXMgjAbdqz862ncvLq0qlxviLhVT4cGI6dVutNrQqdhYVj0nArZDemMxarcblZRl+HLNdLLzCaZsguX6/t1j4omtV4a4+qCdwXRfc1m53OBc8FmqhG1QcZ9rtDkB1FFtUJOBWZ73FYn6n0200WtPpVNe1KOQwQq/OZnPbtl3X+VWsWALuYcUwdM9zG41mt9vjer9YBITiwHNsMM+bqarYBqsq2qNXxuMJLGjbhgWtRidFG+xOWek+TFYJuBUJBXX90cgeDgd4+BHpxMM2HBXVhuE4VaTwFfxTbHH4a+Oxw2sRi4oExYhU/z8X/axBLIbT4abBWbPt8bK8LxLClgMnksjA7yofelDp2Wy2er0hHr0ard523KfCF53XhVGpmqbhcVNoYJpIBAUy9OijUsUO4w23z40mJOBW5qbNDEN79uywWCxwKA5aRo0K0d1WdInuNggDODJfYrlcbmtr07Ynb9++q9UaUesNE4LbFSzJIpFIJJOJxULhKrpItueQTsNqZTabTSYTx5n6ftT6wUCb+tCrEnArNWQAuOl06rpulNSpwvo0BK2+hLS4qQfqPDouaphsOPHOUonkgnK6aPbN/VWDRAm4h93fDDhurhYpkIWD3oRjuAUDjlryRrE1eAhijsKpVG5GvohUT/C7HmSKosVimtBUJ9yWURcLhZImItcRnIryddFTFsRjuGXHZh5EpEQGbaphaIYBlpNxOCmrUKkLam0BfSqrtlb76KmVGs1SCKatRUSrchG+IZvZrPqpM+DicTMeNyJiwjG9UStZVfQKGvEYzvd97PRkMkEtkqKjVH1VjRlGHPdORywScCsEHLY5AJdIWJEyQANy04LeUKL75uIBDq9QqaaZ4O7M0dCqgeFqGLqm6THBO+oLSRLU4zI8reA+01UiwKmL+4OnJeBWBbiYacZh08TCO0DjNyo1aKoiVepjaVWYcUnTtKJBb5S1EMzW0bgiWgJudcLTg6BSU6k0IMcD5qMAOYUMiRB0whOxA+Yc+iWdDjxV2v3hP8ZXFT7aYqdBMtxqZT4PvLZEwkqnU7qui25Efyaz05CTuKoKn2UubhdzDYCjaFzI/Ya70zzqFiU+W4u32YOUOB9aNZEItGosEgKGM3h+tXQaHmfb48rNYJybHotEZCQYXZdKJddkJmLkAMcIs6w4liEKgIPpBkbn0y0eYycu7IQcbwDDWddjmUwqm83SRPkwO6pcpjUaDa+uyjR72KIjfFEH94o6TwNeG821TWINXNcNNb0Fpwvdbu+f/3xbrzd2d4uFQgE7TVCS08VEW3Bs3+8Pe71hLBb6zvlB23LX9Wy71em0Ly8vDg8Pvv/+75lMRkRqV0VEGzZ9p9N99+7jxcUldSYM/yk+iNw0DSjSdrtXLlfG44m04Vaz2YPSpcFg8PHjLx8+fLRtG0Z0FABHoTiINpsZqmrcfSicJacK99BHI/vTp+OPHz/hDY99jkVD+EgF+82yBHZURVotbiQNZXp+ft3r9SklTo9FThZCJwIK1HKVB7L4y3EFKnFb1Dpgcgk+T0QR8t4F6mIehN/wrGG0WZbFwYLIkVtwx4qqarBluZpLMtzD7m/KtDb0oGIuFkHAMcJ45hMnZkqGe3C/gdIQ1Wg2h2OmNwyNisCFFOHadcV0PaigUdXINqlQ4JvDWxJ0y4m3bHSeaEbSP70142DEiptrLhLg4DTgD0y4RCJhmvFo5Pr+1lUPsp3JZ5KAW1FcAI5qXNfjEfQZcPswJZJJE16TDPyuhuSCXF8KjESoKPXfqxUUC8aFjgoJdrR1v5lNlOal3loUwBj0KQFOkU7DihgOTxpOg2UZihItgltWclhwm6giWgJuJUYMdnY8EPbUIqdS0+k0eeiisruITgM3s4mHoAz99wMuONmj/FNf2nCrCw0sy9C16PgNPCwV90q5SVqQBCxtuBU6qkFPQjx6sqMjpFW5/FvooLeQgMPuTqczyWRSXM3yewmOtlmAtmw2C4YT9OQ+Jmj3JLymAklGJDLCgys1Td3a2gLghDYkRLThgqw4oC2TycB1iE5MRNf1Uqm4NCSkSl2twGnI5TLLFnEh16o0OlEpFDZ3drZ1XdTUS4EBx8NSoVwymSxZMyEGnELTiP3t7cI333y9vb05n4s9hVxUwOHKNzY2isVSPG6AAMKKOZoMu9je3v7b3948f/5ssQD+5nKa4CMADrscXsPTpwc7O0WeER0yqOEeXXeKr3t7pe+//+tXX72E0+C6nuhbSxd3PTRtDpvmL3/51vNmlUrNdV3DMMJRXIM7Arel00mw2uvXX+3uFjVNm05druqQgHscXxXGja4bT58eAmQ//fTx5qY8nTqqqgkNOxo/PIdLtL+/++LF0dOnT/P5HHYX0BYLRRcVgWPWMOTABIw500zm85nLy8tOp+c4UyrsEvLWsIuwZw4Onvz1r2+AObwH1YWpH5nYlQHgA88LNCmUDhRQqVQ8P7+oVmvj8cT354oiXtYY6C2ZTB4e7u/t7WIvOY4Tsu53wpeiEOY8GNTZbDqbfb27u3N6evrhw3G73VaUhXA8h9sxDM2yLLLkXOAvZM3IhAccrwe8VDBBIpHc2SmB2xqNVqvVxmqJCLhgsj1dNnzx8LW+C0mxHRZmNvPJaYAaVXVdyMwlumAFmpT8HiWUnWTDU05MKWIKWM0LZM5V0wLehcpD3JYQlIBb36W67bAE2IEeBE0kwfUvZ2opoTw9CVvDBF4kTohdvhfp4glwKvVH4oZcCwm4tV6yGFWaCLpaXOYNA5Q7p4TygDhkgGNDjsNvd8ymCHLpt6l+cBrIJFjQlSsScGKATswk7IWuq6Zp8ORnHgkiAbfWCwaksd8gXFNSyiPnCkhTVQ3gTToNAqwZFREqFI2LCUdyFPUN5qIu++FLG04AL08hi1vIqCk3c6BZAKBnXwJOgAUjL1UzDJ1tcLGunxIOFFw8ACduIWDknAZukQnTmxrhCrZouG6aWKeFtTgoTIBTKDq/MAwjnU5j2biIVZSr57zLra18LpcO8VCAUB1tQSl5ngd9lM/nNjY2VFWfzWZCkBwnMGcymZ2dUiJh8T4J5ZTEsDkNXNS0uZnb399JpZKzmTef++u/crhsmJ57e/sHB08MIw7wSYYTguQUzsfU9fjBwcHR0ZGum47jrDkxw9cBwra2tl6+fAaSo8rTWFglfIf3Cy4C2Nzc+Prrl4eH+/hsMnHW84yIT0RweaYZf/HiCPo0dltnLwEnDsnFqH4YOMP6fffdmydPnvj+zPOmypo1VWOfxrZtvH/16tlXXz1PJEw/lFmX92MI4bulu6RzXdfBcLOZO597tVpTUTw4sOsz1JYqAmcwNJ8/f4aNkcvlSZkuJOCEFFAFDKN4PH50dDiZTMZjt9/vUy4G5zY+/rq6rhuPm69evfjuu28KhS2azDmPhV3CPLGKMZdIJJ49O3r27DAeN7DGa6OyQG9+Pp8H4IrFAtc/xyIgIR+RhlX0/UU2mz042NvYyOE9dSFZrMFmWOi6sbGR39zMc4ukWDQk/DP5gDlo0kwmm8vlNE2D2fTo6hRGJnAPFwF7wDB06FLqGR38kYALgWIFyc0ty6J2zCqfUT66u0pVtAnQG80NC0pROaUq9BJOp0FZyrLKQU0mrWw2AyMdZtwa+KcKJfcGg1+pKFCDM7PcG7A75yG250ILOBpTrnL2r2WZoLdSqZjNpkajIZaTZms8ov5aUPutablcnc8Xphn03kkkLMOI4w/eU123F8qW2Xr4oIa1hA3ebndsewzMgUWwltBcnjejinZtHWIiQJXjTE9Ozm5ubri3QzKZxK5IJJKl0nahsIVLxQVz4aAE3PoKZS+q7Xb73btfarWGYQRDkrCcYBEoU9ueUG7m46ctcZOAQSAL0rBBNYNpmvi8WNz67rtvDw8PwHa45hA0IQwt4LAuwBZsoEajdXp6BpKDJwj6AE9oQWWxyuu6VnzMLxyHG48ncKKHwwHMzlQqubu7A+W7DkanBNx/9vugPaExYaU1m63RaISFxF/ZZoKphB9RSdZK+9/zJHhuXdAT7uLiMpfLpNPpTCY9JwkNyYUqARP0Bkev2WzW6w3gz7JghlMvzKWs87Ld1nDTvEDXdT59OsEfOBawPsN0vhoSwIEedB2mtzYcjiqVSrvdxYcgvF8hTAie0IN+XWa323v//mO5XME140ZCExMOE+AMMEGr1a5W69BKMN3AF4uFeOMGqXAr6IsNnj49PR8OhzThSQJu7aIh+mTiNBqNXq/H7mpMzH4w3OQBmnQ2m11f39zc1Mg8jYcjLBcGwHGlFr5Ck9ZqTcCODos0cW+HvWlw9mAwvLy8xqtlhYTkwgM48AHoDf4p1dsZMZHbXXHsjW+qXq/DDQpNv98wAI7OIlXbttvtzng8XnZ7CImMx5NOpzuZTIUeBB0ewBG96URvrWbz353LQ5CrzQfBMZoWQgNDJMOtTRzBtkflcrXb7TLhhSZMytspmUzChuNR2KLfmir6elA4dzEY9Nvt9nQ6DcGS3N0a2DoeN4rF4v7+HjDHBRkkqrj3KPSsLZ+TLDxvWq+3e70B4y8c+pQDiMAW+Ho4HFYqCjlDmmlalmXiQ8qc81j3SsA93DLchqkArDgJ/lqtNsrlymQyoQS4kChTiiwG+qfV6jjOW2r8C/BpyWRib6+0s7ODnQY3Yj73qC+EMI1IdKGgBiOGW+AGbZexv+v1Rq1Wv76+aTSaPDQoTJk81EMpNhyOBoPhXZISQFat1vf2Gvv7u8ViKZ1OYtfxfFUhEpl0EaC2WE6gsrjT4Hjs9Pv9RgPEVgXgaHagD7CFMkX2rlEc5/ABW/V6nU/wnjzZh3m3vb0JtjOMIOGPu+CsM+z0NYdabBlzJzzFHGfcbvdubqp43Hjoo9EIj5gMHS2UaGOeu69nOUoCbFUqlU6ne3NT2d/fOTh4sr1d4FTTGdVEsEsrAfc7FOjdECCK6yq2PW42m1UwWq3RbHZGI5unaVEOXPhrz361AzmNfjIZX1/bnU4bz2R3twTYFYuAHVwKlagu4MR1S1JfR8CRvazQU4VR7He7g16vg2eK3dxqtRzHpSIUFW5DLMLCGX4AFiyKq6syrFhYtFCyQN7m5hY82cViPpv5s7l/57WvA/L0tdq+7IgxpUFrdLu9ZrNVqTTq9Vq/P5hOXTLmVIp9LGJSCHZU3T2fTJyLiwB2hcIWYLe3t7u9vZVImNixnuezko2tQUag/ugg4zdcucRQm06dZrMH7Vmp1JrNNpSp501JNWiUJ8b9bxWJtjuFQDWRQbMSPCt4VLBu4U49ebJ3cLBXKGxaVtDDFW4stQd9ZJdCf0SoMaVxAN0wTEBtPB7BA4PjSSkSrdFoTI0aNMqmvD1CCH1Dqz/qWyhUAalSMY5zfX0F8wPe1cHBPmBXKhVSqSQg57oeF0k8luGrPxar8ZBGqjlQuWCu3e5UKtVy+QbOF7U5mtN4ZG1ZCCPlc9nOJwHXXV1dw9PCU3369BDO7MbGBthuPp8BedwdbPVsp6+W0oKNyKoTSAO7u+602x21Wh04BLB5e70edue9ue+KokjV+UciKWx4AFK2bZ+fXzYarXK5CNuuVCrl87lk0qIG3EEIhRs3rewIWn94nMUofqFwtIxbacBjh7oEk1FyYavdboPhHMeh2T86RXdVibQvZNups5nX72Mn23jaW1uFvb3i3t4OPFlqLgE/l0N3Ps/xeWjc6Q9KaXdBIxAb6VDVcWbwPQE14Ay2GrhtMpnghrlIU1WN0KR7rA/bGUZc04IeOXjyg8Gw0ajDttvd3SkEks9kMpZlkhc7v+uj83BLoD/c9qIWVAr3osImGw5Hw6HdbndhUkB7guodZ0rWK/+MJnH2kGsRbHd2F4C58XiCJchkUqXSDiFvI5vNJhIJLIRHTsXDNTXTvyylcXo33x55Az4UJcyyXq9brQYlB71eH8jjxDUaihXnDgxSVqNh2aXAunBOQLvdu7oqFwqbcCkAvnw+k0gEx7LzpXzxI7IvBjiyUxlvKtkNs+FwDD4LbLRWGzoUUAPycLOAIzh8+dM8Nk9GOlbNdiAzwMl1XbBAp9OpVmtbW5s7O8Xd3d3t7UIymeDa2Du2WxfALRsUxLiHIy4P3sBoNAS8Op0geNvtBm2z2EqDiUqZRRoHgch5l1B7hJjUnW3NYws9z8N6wbGo1WpXVzfEdkXgD3oWS4Y1Bey+VEm5/megtqQ0HnAxnkyc4XDYbLZx3bBPAyPNmXBVi2VZpGpVHpMQ+vEX6y+8BGz/UHOJ4CQCtt14fNNqNbPZzM7Ozv5+wHaZTNY0TWCVc5/+JOz+CODUpfqEfvQ8FwZZrwffJ1CdvV5vNBrRYZQH2o7HddOM82Za8pmktLWDHXt4QB3YAY6q47iTCfTs4Pq6vL29fXh4sLe3k8mkeawKR5X/MOz030Vpt4QWNASdTSaTfh+qs0uGWgeMPB7zSZRCcd34sjfWIjpDCITWs3zSaJoq6dlgZBlWttcbwAovl0v7+3ul0nY+n4vHTVh31HP9jzCI/hlXA0qLkZkZ/LDjgM8G3W6XumK1Ya4Rn7lsjRqGRYC8PfTkWKIUgZDH5RG6HsCO+5v0+wO4tLVaHWwHJQvHIpcLnFnq6eTzuCbiPGalPwG4uzAHNCNgBKbF/12pVMG08DqBM4AP/w0uDibafedZep3h4DzqFBanmglvMADs+Kwiv7sbmHd0RJagrhoKn1V8jmmu/3+RG43aYPmtVufqqlIu3zQajcGgj98OpWlZJrULjcmYbbiRx30dYRfBKQTyms3WzU1lc3OjUCgUi4VcLsunZGwCMtv9X4jQ/4tnwOC1bRusdnZ2fn1dAcpxDfjVpqnLI6gIBvASCVhv8Cqcq6tytVpPpZKA3e5usQT7bnsrlUpblua6Mw6j/A7AUUQ6yCOt1drn5+eXlxftdtvz5pzowcac1JxR47m7AIWqasRk814vOJyt1xu53BX0LBdVpFIpzn3/jwPE9N8SG2d2TCbjy8vrjx9PQW94TwWhFuUULSTQIo48MuvVxULnc4jxeAyDHkYXdOCTJ3vPnz8F4ZHtp/J07vuqUP+N0RactbVaLfDa8fEptVtbkCesy4CtlF8RHus66mM3d12vWq31et1Wq3l09Ozo6GBjYwOgw+cAzp1Vdws47tOBb5Marb1//+Hs7ArI5ZEaUn1K+a/OLDCnsQ0GeMG8a7cD2L169ergYNc0Tc70ZMzdtn6hw43gdAM//fbtT5eXN9S6Jy5u41IpK4TdfdM/sN5se/T+/cdOpzsef/3y5YtkMgWTbDbzgiAax5eBrenUPTu7+PHHnyqVCr79q9CaFCmfSXjkzCZpdF3QYchx3NevX+dy6cVC87xZEN2gwWfeycnZDz/8BI8DbqhhxCXYpPyZGAoIC8jr9foAFfTpmzdfZ7PZQJcCba7r/vLL8Q8/vGu3W3AOoFulxSblzwvUJpA3Go1+/vmdpinffvtNJpMKTmGPj89//PEdrDyOsUm0SflSGpY8UXM4tN+/Pz45OXfdmQ677e3bd51O515EV4qULyac5tnv946PT/L5rPb3//nfer3O0RT5dKQ8EObmcx/+g+/7aqVSo+NRiTYpDyjwDTzPvbq6ViXapKxMsY5Gtkp5w7JQT8qDOxA83/G2qkU+ESkPLVybKLlNyipJTgJOygpFkdablFUrVvkIpEjASZGAkyJFAk6KBJwUKRJwUiTgpEjASZEiASdFAk6KFAk4KRJwUqRIwEmRgJMiASdFigScFAk4KVIk4KRIwEmRwvIvAQYA4R4tXz2eN0AAAAAASUVORK5CYII=',
        order: 0,
        original: '/static/persiceApp/src/assets/empty_avatar.png'
      };

      this.cropAndSavePhoto(defaultPhoto);

    }
    else {
      this.photosService.delete(photo.resource_uri, (res) => {
        this.refreshPhotos();
      });
    }

  }

  refreshPhotos() {
    this.loadingPhotos = true;
    this.getPhotos(this.user.id);
  }

  replacePhoto(event) {
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
    let data = { objects: this.profilePhotos.slice(1) };

    this.photosServiceSubscriberUpdate = this.photosService.batchUpdate(data)
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
    }
    else {
      profilePhoto = dstImg;
      otherPhoto = srcImg;
    }

    let data = { objects: [otherPhoto] };

    this.photosServiceSubscriberUpdate = this.photosService.batchUpdate(data)
      .subscribe(data => {
        let image = {
          original: profilePhoto.photo,
          order: 0,
          cropped: profilePhoto.cropped_photo
        };

        this.convertToDataURLviaCanvas(profilePhoto.photo, 'image/png', (base64Img) => {
          image.cropped = base64Img;
          this.photosService.update(image, profilePhoto.resource_uri, (res) => {
            this.userMeService.getProfileUpdates();
            this.refreshPhotos();
          });
        });

      }, err => console.log('could not change profile photo', err));

  }

  convertToDataURLviaCanvas(url, outputFormat, callback) {
    let img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
      let canvas = <any>document.createElement('CANVAS');
      let ctx = canvas.getContext('2d');
      let dataURL;
      canvas.height = this.height;
      canvas.width = this.width;
      ctx.drawImage(this, 0, 0);
      dataURL = canvas.toDataURL(outputFormat);
      callback(dataURL);
      canvas = null;
    };
    img.src = url;

  }


  convertFileToBase64viaFileReader(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function() {
      var reader = new FileReader();
      reader.onloadend = function() {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.send();
  }

  ngOnDestroy() {
    if (this.photosServiceSubscriberUpdate) {
      this.photosServiceSubscriberUpdate.unsubscribe();
    }
  }


}
