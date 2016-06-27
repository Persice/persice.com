import {Component} from '@angular/core';
import {RouterOutlet, RouteConfig} from '@angular/router-deprecated';

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
export class EditMyProfileMobileComponent { }
