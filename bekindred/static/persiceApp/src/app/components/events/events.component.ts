/// <reference path="../../../typings/_custom.d.ts" />

import {Component, NgClass} from 'angular2/angular2';
import {RouteConfig, RouterLink, ROUTER_DIRECTIVES, Router, Location} from 'angular2/router';


import {StringUtil} from '../../core/util';

import {SubnavComponent} from '../subnav/subnav.component';
import {EventsMyListComponent} from '../eventsmy/eventsmy_list.component';
import {EventsMyMapComponent} from '../eventsmy/eventsmy_map.component';
import {EventsMyCalendarComponent} from '../eventsmy/eventsmy_calendar.component';
import {EventsAllListComponent} from '../eventsall/eventsall_list.component';
import {EventsAllMapComponent} from '../eventsall/eventsall_map.component';
import {EventsAllCalendarComponent} from '../eventsall/eventsall_calendar.component';
import {EventsNetworkListComponent} from '../eventsnetwork/eventsnetwork_list.component';
import {EventsNetworkMapComponent} from '../eventsnetwork/eventsnetwork_map.component';
import {EventsNetworkCalendarComponent} from '../eventsnetwork/eventsnetwork_calendar.component';

let view = require('./events.html');
@Component({
  selector: 'events',
  template: view,
  directives: [
  SubnavComponent,
  ROUTER_DIRECTIVES,
  RouterLink,
  NgClass
  ]
})
@RouteConfig([
{
  path: '/my/list',
  component: EventsMyListComponent,
  name: 'MyEventsList'
},
{
  path: '/my/map',
  component: EventsMyMapComponent,
  name: 'MyEventsMap'
},
{
  path: '/my/calendar',
  component: EventsMyCalendarComponent,
  name: 'MyEventsCalendar'
},
{
  path: '/all/list',
  component: EventsAllListComponent,
  name: 'AllEventsList'
},
{
  path: '/all/map',
  component: EventsAllMapComponent,
  name: 'AllEventsMap'
},
{
  path: '/all/calendar',
  component: EventsAllCalendarComponent,
  name: 'AllEventsCalendar'
},
{
  path: '/network/list',
  component: EventsNetworkListComponent,
  name: 'NetworkEventsList'
},
{
  path: '/network/map',
  component: EventsNetworkMapComponent,
  name: 'NetworkEventsMap'
},
{
  path: '/network/calendar',
  component: EventsNetworkCalendarComponent,
  name: 'NetworkEventsCalendar'
}
])

export class EventsComponent {
  activeRoute = {
    list: true,
    map: false,
    calendar: false
  };
  activeRouteNav = {
    my: true,
    network: false,
    all: false
  };
  router: Router;
  location: Location;

  constructor(router: Router, location: Location) {
    this.router = router;
    this.location = location;

  }
  onInit() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }


  activate(path) {

    if (path === 'AllEventsList') {
      this.activeRouteNav = {
        my: false,
        network: false,
        all: true
      };

      this.activeRoute = {
        list: true,
        map: false,
        calendar: false
      };


    }
    if (path === 'MyEventsList') {
      this.activeRouteNav = {
        my: true,
        network: false,
        all: false
      };

      this.activeRoute = {
        list: true,
        map: false,
        calendar: false
      };
    }
    if (path === 'NetworkEventsList') {
      this.activeRouteNav = {
        my: false,
        network: true,
        all: false
      };

      this.activeRoute = {
        list: true,
        map: false,
        calendar: false
      };
    }
    this.router.parent.navigate(['./Events', path]);
  }




  openNewEventModal(event) {
    console.log('opened new event modal');
  }

  activateMap() {
    let path = this.location.path();
    if (StringUtil.contains(path, 'my')) {
      this.activeRouteNav = {
        my: true,
        network: false,
        all: false
      };
      this.activeRoute.list = false;
      this.activeRoute.map = true;
      this.activeRoute.calendar = false;
      this.router.parent.navigate(['./Events', 'MyEventsMap']);
      return;
    }

    if (StringUtil.contains(path, 'all')) {
      this.activeRouteNav = {
        my: false,
        network: false,
        all: true
      };
      this.activeRoute.list = false;
      this.activeRoute.map = true;
      this.activeRoute.calendar = false;
      this.router.parent.navigate(['./Events', 'AllEventsMap']);
      return;
    }

    if (StringUtil.contains(path, 'network')) {
      this.activeRouteNav = {
        my: false,
        network: true,
        all: false
      };
      this.activeRoute.list = false;
      this.activeRoute.map = true;
      this.activeRoute.calendar = false;
      this.router.parent.navigate(['./Events', 'NetworkEventsMap']);
      return;
    }
  }

  activateList() {
    let path = this.location.path();

    if (StringUtil.contains(path, 'my')) {
      this.activeRouteNav = {
        my: true,
        network: false,
        all: false
      };
      this.activeRoute.list = true;
      this.activeRoute.map = false;
      this.activeRoute.calendar = false;
      this.router.parent.navigate(['./Events', 'MyEventsList']);
      return;
    }

    if (StringUtil.contains(path, 'all')) {
      this.activeRouteNav = {
        my: false,
        network: false,
        all: true
      };
      this.activeRoute.list = true;
      this.activeRoute.map = false;
      this.activeRoute.calendar = false;
      this.router.parent.navigate(['./Events', 'AllEventsList']);
      return;
    }


    if (StringUtil.contains(path, 'network')) {
      this.activeRouteNav = {
        my: false,
        network: true,
        all: false
      };
      this.activeRoute.list = true;
      this.activeRoute.map = false;
      this.activeRoute.calendar = false;
      this.router.parent.navigate(['./Events', 'NetworkEventsList']);
      return;
    }



  }


  activateCalendar() {
    let path = this.location.path();

    if (StringUtil.contains(path, 'my')) {
      this.activeRouteNav = {
        my: true,
        network: false,
        all: false
      };
      this.activeRoute.list = false;
      this.activeRoute.map = false;
      this.activeRoute.calendar = true;
      this.router.parent.navigate(['./Events', 'MyEventsCalendar']);
      return;
    }

    if (StringUtil.contains(path, 'all')) {
      this.activeRouteNav = {
        my: false,
        network: false,
        all: true
      };
      this.activeRoute.list = false;
      this.activeRoute.map = false;
      this.activeRoute.calendar = true;
      this.router.parent.navigate(['./Events', 'AllEventsCalendar']);
      return;
    }


    if (StringUtil.contains(path, 'network')) {
      this.activeRouteNav = {
        my: false,
        network: true,
        all: false
      };
      this.activeRoute.list = false;
      this.activeRoute.map = false;
      this.activeRoute.calendar = true;
      this.router.parent.navigate(['./Events', 'NetworkEventsCalendar']);
      return;
    }

  }




}
