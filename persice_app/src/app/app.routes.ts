import { provideRouter, RouterConfig } from '@angular/router';
import { AuthGuard } from '../common/guards/auth.guard';
import { NoContentComponent } from '../app-mobile/no-content/no-content.component';
import { CrowdDesktopComponent } from './crowd';
import { ProfileLoader } from './profile';
import { ConnectionsDesktopComponent } from './connections';
import { TermsOfServiceComponent } from './info/terms-of-service/terms-of-service.component';
import { PrivacyPolicyComponent } from './info/privacy-policy/privacy-policy.component';
import { EventDesktopComponent } from './events/event';
import { LoginDesktopComponent } from './login';
import { MainComponent } from './main.component';
import { MessagesComponent } from './messages/messages.component';
import { ConversationComponent } from './messages/conversation';
import { NewConversationComponent } from './messages/new-conversation';
import { EventsDesktopComponent } from './events/events-desktop.component';
import { signupRoutes } from './signup';
import { EventsListViewComponent } from './events/events-list-view/events-list-view.component';
import { EventsMapViewComponent } from './events/events-map-view/events-map-view.component';
import { EventsCalendarViewComponent } from './events/events-calendar-view/events-calendar-view.component';

export const rootRoutes: RouterConfig = [
  {
    path: 'login',
    component: LoginDesktopComponent
  },
  {
    path: 'privacy',
    component: PrivacyPolicyComponent
  },
  {
    path: 'terms',
    component: TermsOfServiceComponent
  },
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: '/events/all/list',
        terminal: true
      },
      {
        path: 'events',
        component: EventsDesktopComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            redirectTo: '/events/all/list',
            terminal: true
          },
          {
            path: ':type/list',
            component: EventsListViewComponent
          },
          {
            path: ':type/map',
            component: EventsMapViewComponent
          },
          {
            path: ':type/calendar',
            component: EventsCalendarViewComponent
          }
        ]
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
        path: 'event/:eventId',
        component: EventDesktopComponent
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
