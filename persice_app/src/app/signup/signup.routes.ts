import { RouterConfig } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { SignupInterestsComponent } from './interests';
import { SignupOffersComponent } from './offers';
import { SignupGoalsComponent } from './goals';
import { SignupConnectSocialAccountsComponent } from './connect-social-accounts';
import { SignupComponent } from './signup.component';

export const signupRoutes: RouterConfig = [
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: '/signup/interests',
        terminal: true
      },
      {
        path: 'interests',
        component: SignupInterestsComponent
      },
      {
        path: 'goals',
        component: SignupGoalsComponent
      },
      {
        path: 'offers',
        component: SignupOffersComponent
      },
      {
        path: 'connect',
        component: SignupConnectSocialAccountsComponent
      },
      {
        path: '**',
        redirectTo: '/signup/interests',
        terminal: true
      }
    ]
  }
];
