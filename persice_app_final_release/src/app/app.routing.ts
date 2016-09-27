/* tslint:disable: max-line-length */
import { Routes } from '@angular/router';
import { NotFound404Component } from './not-found404.component';
import { LoginDesktopComponent } from './login/login-desktop.component';
import { PrivacyPolicyComponent } from './info/privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './info/terms-of-service/terms-of-service.component';
import { AuthGuard } from '../common/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginDesktopComponent },
  { path: 'privacy', component: PrivacyPolicyComponent },
  { path: 'terms', component: TermsOfServiceComponent },
  { path: 'signup', canActivate: [ AuthGuard ], loadChildren: './signup/index#SignupModule' },
  { path: '', canActivate: [ AuthGuard ], loadChildren: './main/index#MainModule' },
  { path: '**', component: NotFound404Component }
];
