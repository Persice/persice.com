import { RouterConfig } from '@angular/router';
import { EventsComponent } from './events.component';
import { EventsMyListComponent, EventsMyMapComponent, EventsMyCalendarComponent } from './events-my';
import {
  EventsNetworkListComponent,
  EventsNetworkMapComponent,
  EventsNetworkCalendarComponent
} from './events-network';
import { EventsAllListComponent, EventsAllMapComponent, EventsAllCalendarComponent } from './events-all';

export const routesEvents: RouterConfig = [
  {
    path: 'events',
    component: EventsComponent,
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
  }
];
