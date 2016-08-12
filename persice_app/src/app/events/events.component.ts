import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { Location } from '@angular/common';
import { StringUtil } from '../shared/core';
import { FilterDesktopComponent } from '../shared/components/filter';

@Component({
  selector: 'prs-events',
  template: <any>require('./events.html'),
  directives: [
    ROUTER_DIRECTIVES,
    FilterDesktopComponent
  ]
})
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

  constructor(private router: Router, private location: Location) { }

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
    if (path === '/all/list') {
      this.markNav('all');
      this.markSubnav('list');
    }

    if (path === '/my/list') {
      this.markNav('my');
      this.markSubnav('list');
    }

    if (path === '/network/list') {
      this.markNav('network');
      this.markSubnav('list');
    }

    this.router.navigateByUrl('/events' + path);
  }

  activateMap() {
    let path = this.location.path();
    if (StringUtil.contains(path, 'my')) {
      this.markNav('my');
      this.markSubnav('map');
      this.router.navigateByUrl('/events/my/map');
      return;
    }

    if (StringUtil.contains(path, 'all')) {
      this.markNav('all');
      this.markSubnav('map');
      this.router.navigateByUrl('/events/all/map');
      return;
    }

    if (StringUtil.contains(path, 'network')) {
      this.markNav('network');
      this.markSubnav('map');
      this.router.navigateByUrl('/events/network/map');
      return;
    }
  }

  activateList() {
    let path = this.location.path();

    if (StringUtil.contains(path, 'my')) {
      this.markNav('my');
      this.markSubnav('list');
      this.router.navigateByUrl('/events/my/list');
      return;
    }

    if (StringUtil.contains(path, 'all')) {
      this.markNav('all');
      this.markSubnav('list');
      this.router.navigateByUrl('/events/all/list');
      return;
    }

    if (StringUtil.contains(path, 'network')) {
      this.markNav('network');
      this.markSubnav('list');
      this.router.navigateByUrl('/events/network/list');
      return;
    }
  }

  activateCalendar() {
    let path = this.location.path();

    if (StringUtil.contains(path, 'my')) {
      this.markNav('my');
      this.markSubnav('calendar');
      this.router.navigateByUrl('/events/my/calendar');
      return;
    }

    if (StringUtil.contains(path, 'all')) {
      this.markNav('all');
      this.markSubnav('calendar');
      this.router.navigateByUrl('/events/all/calendar');
      return;
    }

    if (StringUtil.contains(path, 'network')) {
      this.markNav('network');
      this.markSubnav('calendar');
      this.router.navigateByUrl('/events/network/calendar');
      return;
    }
  }

}
