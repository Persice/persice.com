/* tslint:disable: variable-name */
import { Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CrowdDesktopComponent } from './crowd/crowd-desktop.component';
import { ConnectionsDesktopComponent } from './connections/connections-desktop.component';
import { UserProfileDesktopLoader } from './user-profile-desktop-loader/profile-loader.component';
import { MessagesComponent } from './messages/messages.component';
import { NewConversationComponent } from './messages/new-conversation/new-conversation.component';
import { ConversationComponent } from './messages/conversation/conversation.component';
import { EventsDesktopComponent } from './events/events-desktop.component';
import { EventsListViewComponent } from './events/events-list-view/events-list-view.component';
import { EventsMapViewComponent } from './events/events-map-view/events-map-view.component';
import { EventsCalendarViewComponent } from './events/events-calendar-view/events-calendar-view.component';
import { EventDesktopComponent } from './events/event/event-desktop.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [ AuthGuard ],
    children: [
      { path: 'crowd', component: CrowdDesktopComponent },
      { path: 'pals', component: ConnectionsDesktopComponent },
      {
        path: 'messages',
        component: MessagesComponent,
        children: [
          { path: '', redirectTo: '/messages/new', pathMatch: 'full' },
          { path: 'new', component: NewConversationComponent },
          { path: 'new/:friendId', component: NewConversationComponent },
          { path: ':threadId', component: ConversationComponent }
        ]
      },
      {
        path: 'events',
        component: EventsDesktopComponent,
        children: [
          { path: ':type/list', component: EventsListViewComponent },
          { path: ':type/map', component: EventsMapViewComponent },
          { path: ':type/calendar', component: EventsCalendarViewComponent },
          { path: '', redirectTo: '/events/all/list', pathMatch: 'full' },
        ]
      },
      { path: 'event/:eventId', component: EventDesktopComponent },
      { path: '', redirectTo: '/events/all/list', pathMatch: 'full' },
      { path: ':username', component: UserProfileDesktopLoader }
    ]
  }
];
