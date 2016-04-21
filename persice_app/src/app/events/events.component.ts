import {Component, OnInit} from 'angular2/core';
import {
  RouteConfig,
  RouterLink,
  ROUTER_DIRECTIVES,
  Router,
  Location
} from 'angular2/router';

import {StringUtil} from '../shared/core';

import {FilterDesktopComponent} from '../shared/components/filter';

import {EventsListSubnavComponent} from './events-list-subnav';

import {
  EventsMyListComponent,
  EventsMyMapComponent,
  EventsMyCalendarComponent
} from './events-my';

import {
  EventsNetworkListComponent,
  EventsNetworkMapComponent,
  EventsNetworkCalendarComponent
} from './events-network';

import {
  EventsAllListComponent,
  EventsAllMapComponent,
  EventsAllCalendarComponent
} from './events-all';


@Component({
  selector: 'prs-events',
  template: require('./events.html'),
  directives: [
    EventsListSubnavComponent,
    ROUTER_DIRECTIVES,
    RouterLink,
    FilterDesktopComponent
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

export class EventsComponent implements OnInit {
  showGender: Boolean = false;
  activeRoute = {
    list: true,
    map: false,
    calendar: false
  };
  activeRouteNav = {
    my: false,
    network: false,
    all: true
  };
  router: Router;
  location: Location;

  constructor(router: Router, location: Location) {
    this.router = router;
    this.location = location;

  }
  ngOnInit() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    this.checkUrl();
  }

  checkUrl() {
    let path = this.location.path();

    //list
    if (StringUtil.contains(path, 'my/list')) {
      this.markNav('my');
      this.markSubnav('list');
    }
    if (StringUtil.contains(path, 'network/list')) {
      this.markNav('network');
      this.markSubnav('list');
    }
    if (StringUtil.contains(path, 'all/list')) {
      this.markNav('all');
      this.markSubnav('list');
    }

    //map
    if (StringUtil.contains(path, 'my/map')) {
      this.markNav('my');
      this.markSubnav('map');
    }
    if (StringUtil.contains(path, 'network/map')) {
      this.markNav('network');
      this.markSubnav('map');
    }
    if (StringUtil.contains(path, 'all/map')) {
      this.markNav('all');
      this.markSubnav('map');
    }

    //calendar
    if (StringUtil.contains(path, 'my/calendar')) {
      this.markNav('my');
      this.markSubnav('calendar');
    }
    if (StringUtil.contains(path, 'network/calendar')) {
      this.markNav('network');
      this.markSubnav('calendar');
    }
    if (StringUtil.contains(path, 'all/calendar')) {
      this.markNav('all');
      this.markSubnav('calendar');
    }



  }

  markNav(type) {

    switch (type) {
      case 'my':
        this.activeRouteNav = {
          my: true,
          network: false,
          all: false
        };
        break;
      case 'all':
        this.activeRouteNav = {
          my: false,
          network: false,
          all: true
        };
        break;

      case 'network':
        this.activeRouteNav = {
          my: false,
          network: true,
          all: false
        };
        break;
      default:
        break;
    }

    this.activeRoute = {
      list: true,
      map: false,
      calendar: false
    };
  }

  markSubnav(type) {
    switch (type) {
      case 'list':
        this.activeRoute = {
          list: true,
          map: false,
          calendar: false
        };
        break;
      case 'map':
        this.activeRoute = {
          list: false,
          map: true,
          calendar: false
        };
        break;

      case 'calendar':
        this.activeRoute = {
          list: false,
          map: false,
          calendar: true
        };
        break;
      default:
        break;
    }
  }


  activateMain(path) {

    if (path === 'AllEventsList') {
      this.markNav('all');
      this.markSubnav('list');
    }
    if (path === 'MyEventsList') {
      this.markNav('my');
      this.markSubnav('list');
    }
    if (path === 'NetworkEventsList') {
      this.markNav('network');
      this.markSubnav('list');
    }

    this.router.parent.navigate(['./Events', path]);

  }




  openNewEventModal(event) {
    console.log('opened new event modal');
  }

  activateMap() {
    let path = this.location.path();
    if (StringUtil.contains(path, 'my')) {
      this.markNav('my');
      this.markSubnav('map');
      this.router.parent.navigate(['./Events', 'MyEventsMap']);
      return;
    }

    if (StringUtil.contains(path, 'all')) {
      this.markNav('all');
      this.markSubnav('map');
      this.router.parent.navigate(['./Events', 'AllEventsMap']);
      return;
    }

    if (StringUtil.contains(path, 'network')) {
      this.markNav('network');
      this.markSubnav('map');
      this.router.parent.navigate(['./Events', 'NetworkEventsMap']);
      return;
    }
  }

  activateList() {
    let path = this.location.path();

    if (StringUtil.contains(path, 'my')) {
      this.markNav('my');
      this.markSubnav('list');
      this.router.parent.navigate(['./Events', 'MyEventsList']);
      return;
    }

    if (StringUtil.contains(path, 'all')) {
      this.markNav('all');
      this.markSubnav('list');
      this.router.parent.navigate(['./Events', 'AllEventsList']);
      return;
    }


    if (StringUtil.contains(path, 'network')) {
      this.markNav('network');
      this.markSubnav('list');
      this.router.parent.navigate(['./Events', 'NetworkEventsList']);
      return;
    }



  }


  activateCalendar() {
    let path = this.location.path();

    if (StringUtil.contains(path, 'my')) {
      this.markNav('my');
      this.markSubnav('calendar');
      this.router.parent.navigate(['./Events', 'MyEventsCalendar']);
      return;
    }

    if (StringUtil.contains(path, 'all')) {
      this.markNav('all');
      this.markSubnav('calendar');
      this.router.parent.navigate(['./Events', 'AllEventsCalendar']);
      return;
    }


    if (StringUtil.contains(path, 'network')) {
      this.markNav('network');
      this.markSubnav('calendar');
      this.router.parent.navigate(['./Events', 'NetworkEventsCalendar']);
      return;
    }

  }


}
