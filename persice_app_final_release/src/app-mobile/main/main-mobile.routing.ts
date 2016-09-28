import { CrowdMobileComponent } from './crowd-mobile.component';
import { MainMobileComponent } from './main-mobile.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    component: MainMobileComponent,
    // canActivate: [ AuthGuard ],
    children: [
      { path: '', redirectTo: '/crowd', pathMatch: 'full' },
      { path: 'crowd', component: CrowdMobileComponent },

    ]
  }
];
