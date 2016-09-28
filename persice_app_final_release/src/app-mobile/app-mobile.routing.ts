/* tslint:disable: max-line-length */
import { Routes } from '@angular/router';
import { MobileNotFound404Component } from './mobile-not-found404.component';
import { AuthGuard } from '../common/guards/auth.guard';
import { LoginMobileComponent } from './login';
import { TermsOfServiceMobileComponent } from './info/terms-of-service';
import { PrivacyPolicyMobileComponent } from './info/privacy-policy';

export const routes: Routes = [
  { path: 'login', component: LoginMobileComponent },
  { path: 'terms', component: TermsOfServiceMobileComponent },
  { path: 'privacy', component: PrivacyPolicyMobileComponent },
  { path: 'signup', canActivate: [ AuthGuard ], loadChildren: './signup-mobile/index#SignupMobileModule' },
  { path: '', loadChildren: './main/index#MainModule' },
  { path: '**', component: MobileNotFound404Component }
];
