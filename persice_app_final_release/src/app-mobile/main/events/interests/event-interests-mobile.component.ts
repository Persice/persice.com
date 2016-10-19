import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AppStateService } from '../../../shared/services/app-state.service';
import { HeaderState } from '../../header/header.state';
import { EventInterestsService } from './event-interests.service';
import { EventInterest } from '../../../../common/models/event/event_interest.model';

@Component({
  selector: 'prs-mobile-event-interests',
  templateUrl: './event-interests-mobile.component.html',
  providers: [ EventInterestsService ]
})
export class EventInterestsMobileComponent implements OnInit, OnDestroy {

  public interests$: Observable<EventInterest[]>;
  public activeTab: ActiveTab = ActiveTab.top;

  public isLoaded: boolean = false;
  public isLoading$: Observable<boolean>;
  private isLoadedSub: Subscription;

  private eventId: number;
  private routerSub: Subscription;

  constructor(
    private appStateService: AppStateService,
    private interestsService: EventInterestsService,
    private router: Router,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit(): any {
    document.querySelector('html').classList.toggle('bg-gray-3');

    this.appStateService.headerStateEmitter.emit(HeaderState.attendees);

    this.isLoading$ = this.interestsService.isLoading$;
    this.isLoadedSub = this.interestsService.isLoaded$.subscribe((state: boolean) => {
      this.isLoaded = state;
    });

    this.interests$ = this.interestsService.interests$;

    // Get eventId from route param and start loading attendees and counters
    this.routerSub = this.route.params.subscribe(params => {
      this.eventId = params[ 'eventId' ];
      // Start Inital load
      this._loadData(this.activeTab, true);

    });
  }

  ngOnDestroy(): any {
    document.querySelector('html').classList.toggle('bg-gray-3');
    if (this.isLoadedSub) {
      this.isLoadedSub.unsubscribe();
    }
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  public activateTab(index: number) {
    this.activeTab = index;
    this._loadData(this.activeTab, true);
  }

  public viewAttendeesWithInterest(interest: EventInterest) {
    this.router.navigateByUrl('/event/' + this.eventId + '/attendees?interest=' + interest.id + '&title=' + interest.name);
  }

  public loadMoreData(event: MouseEvent) {
    if (!this.isLoaded) {
      this._loadData(this.activeTab, false);
    }
  }

  private _loadData(tab: ActiveTab, initial: boolean) {
    if (initial) {
      this.interestsService.loadInitial(ActiveTab[ tab ], this.eventId);
    } else {
      this.interestsService.loadMore(ActiveTab[ tab ], this.eventId);
    }

  }

}

enum ActiveTab {
  top = 1,
  my = 2
}
