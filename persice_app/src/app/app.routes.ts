import { provideRouter, RouterConfig } from '@angular/router';
import { routesMessages } from './messages/';
import { routesEvents } from './events/';
import { NoContentComponent } from '../app-mobile/no-content/no-content.component';
import { CrowdDesktopComponent } from './crowd';
import { ProfileLoader } from './profile';
import { ConnectionsDesktopComponent } from './connections';
import { TermsOfServiceComponent } from './info/terms-of-service/terms-of-service.component';
import { PrivacyPolicyComponent } from './info/privacy-policy/privacy-policy.component';
import { EventComponent } from './event';

export const rootRoutes: RouterConfig = [
  {
    path: '',
    redirectTo: '/crowd',
    terminal: true
  },
  {
    path: 'crowd',
    component: CrowdDesktopComponent
  },
  {
    path: 'pals',
    component: ConnectionsDesktopComponent,
  },
  {
    path: 'privacy',
    component: PrivacyPolicyComponent,
  },
  {
    path: 'event/:eventId',
    component: EventComponent
  },
  {
    path: 'terms',
    component: TermsOfServiceComponent,
  },
  {
    path: ':username',
    component: ProfileLoader
  },
  {
    path: '**',
    component: NoContentComponent
  },
];

export const routesApp: RouterConfig = [
  ...routesMessages,
  ...routesEvents,
  ...rootRoutes
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routesApp)
];
