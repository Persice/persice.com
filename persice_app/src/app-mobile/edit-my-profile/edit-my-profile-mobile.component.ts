import {Component, OnInit, OnDestroy} from '@angular/core';
import {RouterOutlet, RouteConfig, Router, RouteParams} from '@angular/router-deprecated';

import {AppStateService} from '../shared/services';

import {EditMyProfileNavigationComponent} from './navigation';
import {EditInterestsMobileComponent} from './edit-interests';
import {PersonalInfoMobileComponent} from './edit-personal-info';
import {ReligiousViewsMobileComponent} from './edit-religious-views';
import {PoliticalViewsMobileComponent} from './edit-political-views';
import {EditPhotosMobileComponent} from './edit-photos';
import {EditGoalsMobileComponent} from './edit-goals';
import {EditOffersMobileComponent} from './edit-offers';
import {EditSocialAccountsMobileComponent} from './edit-social-accounts';

@Component({
  selector: 'prs-mobile-edit-my-profile',
  template: require('./edit-my-profile-mobile.html'),
  directives: [RouterOutlet]
})
@RouteConfig([
  {
    path: '/',
    component: EditMyProfileNavigationComponent,
    name: 'EditNavigation',
    useAsDefault: true
  },
  {
    path: '/interests',
    component: EditInterestsMobileComponent,
    name: 'EditInterests'
  },
  {
    path: '/personal',
    component: PersonalInfoMobileComponent,
    name: 'EditPersonalInfo'
  },
  {
    path: '/religious',
    component: ReligiousViewsMobileComponent,
    name: 'EditReligiousViews'
  },
  {
    path: '/political',
    component: PoliticalViewsMobileComponent,
    name: 'EditPoliticalViews'
  },
  {
    path: '/photos',
    component: EditPhotosMobileComponent,
    name: 'EditPhotos'
  },
  {
    path: '/goals',
    component: EditGoalsMobileComponent,
    name: 'EditGoals'
  },
  {
    path: '/offers',
    component: EditOffersMobileComponent,
    name: 'EditOffers'
  },
  {
    path: '/accounts',
    component: EditSocialAccountsMobileComponent,
    name: 'EditSocialAccounts'
  }

])
export class EditMyProfileMobileComponent implements OnInit, OnDestroy {
  public title: string = 'edit';
  public isDoneButtonVisible: boolean = false;
  public isCroppingPhotosDoneButtonVisible: boolean = false;


  private username: string;

  constructor(
    private appStateService: AppStateService,
    private router: Router,
    private params: RouteParams
  ) {
    this.username = params.get('username');
  }

  ngOnInit() {
    this.appStateService.setHeaderVisibility(false);

    this.appStateService.editMyProfileStateEmitter
      .subscribe((state: any) => {
        this.title = state.title;
        this.isDoneButtonVisible = state.isDoneButtonVisible;
        this.isCroppingPhotosDoneButtonVisible = state.isCroppingPhotosDoneButtonVisible ? true : false;
      });
  }

  ngOnDestroy() {
    this.appStateService.setHeaderVisibility(true);
  }

  public goBack(event) {
    switch (this.title) {
      case 'edit':
        this.router.parent.navigate(['./MyProfile', { username: this.username }]);
        break;
      case 'interests':
        this.router.navigate(['EditNavigation']);
        break;
      case 'personal info':
        this.router.navigate(['EditNavigation']);
        break;
      case 'religious views':
        this.router.navigate(['EditPersonalInfo']);
        break;
      case 'political views':
        this.router.navigate(['EditPersonalInfo']);
        break;
      case 'goals':
        this.router.navigate(['EditNavigation']);
        break;
      case 'offers':
        this.router.navigate(['EditNavigation']);
        break;
      case 'accounts':
        this.router.navigate(['EditNavigation']);
        break;
      case 'edit photos':
        this.router.navigate(['EditNavigation']);
        break;
      case 'choose album':
        this.appStateService.setEditPhotosState({ page: 1 });
        break;
      case 'choose photo':
        this.appStateService.setEditPhotosState({ page: 2 });
        break;
      case 'crop photo':
        this.appStateService.setEditPhotosState({ page: 3 });
        break;
      default:
        break;
    }
  }

  public doneCroppingPhoto(event) {
    this.appStateService.setEditPhotosState({ page: 1, savePhotoAndRefresh: true });
  }
}
