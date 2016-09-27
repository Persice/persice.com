import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'prs-events',
  templateUrl: './events-desktop.html'
})
export class EventsDesktopComponent implements OnInit, OnDestroy {
  public activeView: 'list' | 'calendar' | 'map' = 'list';
  public eventsType = 'all';
  private routerSub;

  constructor(private router: Router, private location: Location, private route: ActivatedRoute) {
  }

  ngOnInit() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    const path = this.location.path();
    this.checkUrl(path);

    this.routerSub = this.router.events
      .subscribe((event: any) => {
        if (event instanceof NavigationEnd) {
          const path = this.location.path();
          this.checkUrl(path);
        }
      });

  }

  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  switchView(newView: 'list' | 'calendar' | 'map'): void {
    this.activeView = newView;
    const path = `/events/${this.eventsType}/${newView}`;
    this.router.navigateByUrl(path);
  }

  checkUrl(url: string) {

    let path: string[] = url.split('/');
    this.activeView = <any>path[ 3 ];
    this.eventsType = path[ 2 ];

  }

}
