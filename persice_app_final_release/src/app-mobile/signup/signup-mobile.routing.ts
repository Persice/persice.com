import { Routes } from '@angular/router';
import { AuthGuard } from '../../common/guards/auth.guard';
import { SignupMobileComponent } from './signup-mobile.component';
import { SignupInterestsMobileComponent } from './interests';
import { SignupGoalsMobileComponent } from './goals';
import { SignupOffersMobileComponent } from './offers';
import { SignupConnectSocialAccountsMobileComponent } from './connect-social-accounts';

export const routes: Routes = [
  {
    path: '',
    component: SignupMobileComponent,
    canActivate: [ AuthGuard ],
    children: [
      {
        path: '',
        redirectTo: '/signup/interests',
        pathMatch: 'full'
      },
      {
        path: 'interests',
        component: SignupInterestsMobileComponent
      },
      {
        path: 'goals',
        component: SignupGoalsMobileComponent
      },
      {
        path: 'offers',
        component: SignupOffersMobileComponent
      },
      {
        path: 'connect',
        component: SignupConnectSocialAccountsMobileComponent
      },
      {
        path: '**',
        redirectTo: '/signup/interests',
        pathMatch: 'full'
      }
    ]
  }
];
