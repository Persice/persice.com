import { provideRouter, RouterConfig } from '@angular/router';
import { AuthGuard } from './auth.guard';

import { NoContentComponent } from '../app-mobile/no-content/no-content.component';
import { CrowdDesktopComponent } from './crowd';
import { ProfileLoader } from './profile';
import { ConnectionsDesktopComponent } from './connections';
import { TermsOfServiceComponent } from './info/terms-of-service/terms-of-service.component';
import { PrivacyPolicyComponent } from './info/privacy-policy/privacy-policy.component';
import { EventComponent } from './event';
import { LoginDesktopComponent } from './login';
import { MainComponent } from './main.component';

import { MessagesComponent } from './messages/messages.component';
import { ConversationComponent } from './messages/conversation';
import { NewConversationComponent } from './messages/new-conversation';

import { EventsComponent } from './events/events.component';
import { EventsMyListComponent, EventsMyMapComponent, EventsMyCalendarComponent } from './events/events-my';
import { EventsNetworkListComponent, EventsNetworkMapComponent, EventsNetworkCalendarComponent } from './events/events-network';
import { EventsAllListComponent, EventsAllMapComponent, EventsAllCalendarComponent } from './events/events-all';

import {signupRoutes} from './signup';

export const rootRoutes: RouterConfig = [
  {
    path: 'login',
    component: LoginDesktopComponent
  },
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    children: [
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
        component: ConnectionsDesktopComponent
      },
      {
        path: 'privacy',
        component: PrivacyPolicyComponent
      },
      {
        path: 'event/:eventId',
        component: EventComponent
      },
      {
        path: 'terms',
        component: TermsOfServiceComponent
      },
      {
        path: 'messages',
        component: MessagesComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            redirectTo: '/messages/new',
            terminal: true
          },
          {
            path: 'new',
            component: NewConversationComponent
          },
          {
            path: 'new/:friendId',
            component: NewConversationComponent
          },
          {
            path: ':threadId',
            component: ConversationComponent
          },

        ]
      },
      {
        path: 'events',
        component: EventsComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            redirectTo: '/events/all/list',
            terminal: true
          },
          {
            path: 'all/list',
            component: EventsAllListComponent
          },
          {
            path: 'all/map',
            component: EventsAllMapComponent
          },
          {
            path: 'all/calendar',
            component: EventsAllCalendarComponent
          },
          {
            path: 'my/list',
            component: EventsMyListComponent
          },
          {
            path: 'my/map',
            component: EventsMyMapComponent
          },
          {
            path: 'my/calendar',
            component: EventsMyCalendarComponent
          },
          {
            path: 'network/list',
            component: EventsNetworkListComponent
          },
          {
            path: 'network/map',
            component: EventsNetworkMapComponent
          },
          {
            path: 'network/calendar',
            component: EventsNetworkCalendarComponent
          }
        ]
      },
      {
        path: ':username',
        component: ProfileLoader
      },
      {
        path: '**',
        component: NoContentComponent,
      }
    ]
  },

];

export const routesApp: RouterConfig = [
  ...signupRoutes,
  ...rootRoutes
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routesApp)
];
