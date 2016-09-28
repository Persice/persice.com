import { CrowdMobileComponent } from './crowd-mobile.component';
import { MainMobileComponent } from './main-mobile.component';
import { Routes } from '@angular/router';
import { EventsMobileComponent } from './events/events-mobile.component';

export const routes: Routes = [
  {
    path: '',
    component: MainMobileComponent,
    // canActivate: [ AuthGuard ],
    children: [
      { path: '', redirectTo: '/events/all/list', pathMatch: 'full' },
      { path: 'events/:type/list', component: EventsMobileComponent},
      { path: 'events', redirectTo: '/events/all/list'},
      { path: 'crowd', component: CrowdMobileComponent },
    ]
  }
];
