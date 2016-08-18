import { RouterConfig } from '@angular/router';
import { SignupInterestsMobileComponent } from './interests';
import { SignupOffersMobileComponent } from './offers';
import { SignupGoalsMobileComponent } from './goals';
import { SignupConnectSocialAccountsMobileComponent } from './connect-social-accounts';
import { SignupMobileComponent } from './signup-mobile.component';
import { AuthGuard } from '../../common/guards/auth.guard';

export const signupMobileRoutes: RouterConfig = [
  {
    path: 'signup',
    component: SignupMobileComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: '/signup/interests',
        terminal: true
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
        terminal: true
      }
    ]
  }
];
