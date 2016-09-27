import { Routes } from '@angular/router';
import { SignupComponent } from './signup.component';
import { AuthGuard } from '../../common/guards/auth.guard';
import { SignupInterestsComponent } from './interests/signup-interests.component';
import { SignupGoalsComponent } from './goals/signup-goals.component';
import { SignupOffersComponent } from './offers/signup-offers.component';
import { SignupConnectSocialAccountsComponent } from './connect-social-accounts/connect-social-accounts.component';

export const routes: Routes = [
  {
    path: '',
    component: SignupComponent,
    canActivate: [ AuthGuard ],
    children: [
      {
        path: '',
        redirectTo: '/signup/interests',
        pathMatch: 'full'
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
        pathMatch: 'full'
      }
    ]
  }
];
