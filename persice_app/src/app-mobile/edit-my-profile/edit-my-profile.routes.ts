import {RouterConfig} from '@angular/router';

import {EditMyProfileNavigationComponent} from './navigation';
import {EditMyProfileMobileComponent} from './edit-my-profile-mobile.component';
import {EditInterestsMobileComponent} from './edit-interests';
import {PersonalInfoMobileComponent} from './edit-personal-info';
import {ReligiousViewsMobileComponent} from './edit-religious-views';
import {PoliticalViewsMobileComponent} from './edit-political-views';
import {EditPhotosMobileComponent} from './edit-photos';
import {EditGoalsMobileComponent} from './edit-goals';
import {EditOffersMobileComponent} from './edit-offers';
import {EditSocialAccountsMobileComponent} from './edit-social-accounts';
export const routesEditMyProfile: RouterConfig = [
  {
    path: 'edit-profile',
    component: EditMyProfileMobileComponent,
    children: [
      {
        path: '',
        component: EditMyProfileNavigationComponent,
        terminal: true
      },
      {
        path: 'interests',
        component: EditInterestsMobileComponent
      },
      {
        path: 'personal',
        component: PersonalInfoMobileComponent
      },
      {
        path: 'religious',
        component: ReligiousViewsMobileComponent
      },
      {
        path: 'political',
        component: PoliticalViewsMobileComponent
      },
      {
        path: 'photos',
        component: EditPhotosMobileComponent
      },
      {
        path: 'goals',
        component: EditGoalsMobileComponent
      },
      {
        path: 'offers',
        component: EditOffersMobileComponent
      },
      {
        path: 'accounts',
        component: EditSocialAccountsMobileComponent
      }
    ]
  }
];
