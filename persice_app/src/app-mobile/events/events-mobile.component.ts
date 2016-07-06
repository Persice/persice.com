import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppStateService} from '../shared/services/app-state.service';
import {EventsService} from '../../app/shared/services/events.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadingComponent} from '../../app/shared/components/loading/loading.component';

@Component({
  selector: 'prs-mobile-events',
  template: require('./events-mobile.html'),
  directives: [LoadingComponent],
  providers: [EventsService]
})
export class EventsMobileComponent implements OnInit, OnDestroy {

  events: any[];
  eventsType: string;
  eventsTypeLabel: string;
  isLoaded = false;
  isLoading = true;
  isEventsTypeDropdownVisible = false;

  constructor(
    private appStateService: AppStateService,
    private eventsService: EventsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe(params => {
      this.eventsType = params['type'];
    });
  }

  ngOnInit(): any {
    this.appStateService.setHeaderVisibility(false);
    this.loadEvents(this.eventsType);
  }

  ngOnDestroy(): any {
  }

  selectEventsType(type) {
    this.eventsType = type;
    this.loadEvents(type);
  }

  loadEvents(type): void {
    this.isLoading = true;
    this.setEventsTypeLabel(type);
    this.events = [];
    this.eventsService.get('', 12, false, type).subscribe(response => {
      this.events = response.objects;
      this.isLoaded = true;
      this.isLoading = true;
    });
  }

  clickHeader(): void {
    this.isEventsTypeDropdownVisible = !this.isEventsTypeDropdownVisible;
  }

  clickEventsTypeDropdownElement(type, event): void {
    event.stopPropagation();
    this.loadEvents(type);
    this.isEventsTypeDropdownVisible = !this.isEventsTypeDropdownVisible;
    this.router.navigateByUrl(`/events/${type}`);
  }

  setEventsTypeLabel(type) {
    if (type === 'all') {
      this.eventsTypeLabel = 'All events';
    }
    if (type === 'my') {
      this.eventsTypeLabel =  'My events';
    }
    if (type === 'network') {
      this.eventsTypeLabel =  'My network';
    }
  }
}

export type EventsType = 'all' | 'my' | 'network';
