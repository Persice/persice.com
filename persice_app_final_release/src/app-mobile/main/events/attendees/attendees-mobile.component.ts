import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AppStateService } from '../../../shared/services/app-state.service';
import { AttendeeService } from './attendee.service';
import { AppState } from '../../../../common/reducers/index';
import { Person } from '../../../../common/models/person/person';
import { SelectedPersonActions } from '../../../../common/actions/selected-person.action';
import { HeaderState } from '../../header/header.state';

@Component({
  selector: 'prs-mobile-attendees',
  templateUrl: './attendees-mobile.html',
  providers: [AttendeeService]
})
export class AttendeesMobileComponent implements OnInit, OnDestroy {

  public connections$: Observable<Person[]>;
  public connectionsTotalCount$: Observable<number>;
  public host$: Observable<Person>;
  public others$: Observable<Person[]>;
  public othersTotalCount$: Observable<number>;
  public counterGoing$: Observable<number>;
  public counterMaybe$: Observable<number>;
  public counterNotGoing$: Observable<number>;
  public activeTab: AttendeeTab = AttendeeTab.Going;

  public interest: string = '';
  public isLoaded: boolean = false;
  public isLoading$: Observable<boolean>;
  private isLoadedSub: Subscription;

  private eventId: number;
  private routerSub: Subscription;
  private queryParamSub: Subscription;

  constructor(
    private appStateService: AppStateService,
    private attendeeService: AttendeeService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private actions: SelectedPersonActions
  ) {

  }

  ngOnInit(): any {
    document.querySelector('html').classList.toggle('bg-gray-3');

    this.queryParamSub = this.route
      .queryParams
      .subscribe(params => {
        this.interest = params['interest'] || null;
      });

    this.appStateService.headerStateEmitter.emit(HeaderState.attendees);

    this.isLoading$ = this.attendeeService.isLoading$;

    this.counterGoing$ = this.attendeeService.counters$.map(data => data[0]);
    this.counterMaybe$ = this.attendeeService.counters$.map(data => data[1]);
    this.counterNotGoing$ = this.attendeeService.counters$.map(data => data[2]);

    this.isLoadedSub = this.attendeeService.isLoaded$.subscribe((state: boolean) => {
      this.isLoaded = state;
    });

    this.connections$ = this.attendeeService.attendees$.map(data => data.connections);
    this.host$ = this.attendeeService.host$;
    this.connectionsTotalCount$ = this.attendeeService.attendees$.map(data => data.connectionsTotalCount);
    this.others$ = this.attendeeService.attendees$.map(data => data.others);
    this.othersTotalCount$ = this.attendeeService.attendees$.map(data => data.othersTotalCount);

    // Get eventId from route param and start loading attendees and counters
    this.routerSub = this.route.params.subscribe(params => {
      this.eventId = params['eventId'];
      // Start Inital load
      this._loadData(this.activeTab, true);

      // Get counters shown in tabs
      this.attendeeService.getCounters(this.eventId, this.interest);
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
    if (this.queryParamSub) {
      this.queryParamSub.unsubscribe();
    }
  }

  public activateTab(index: number) {
    this.activeTab = index;
    this._loadData(this.activeTab, true);
  }

  public viewProfile(person: Person) {
    if (person.isNonPersiceUser) {
      window.open(person.url, '_new');
    } else {
      this.router.navigateByUrl('/' + person.username);
    }

  }

  public openNewConversation(person: Person) {
    this.store.dispatch(this.actions.set(person, 'connection'));
    this.router.navigateByUrl('/messages/new');
  }

  public loadMoreData(event: MouseEvent) {
    if (!this.isLoaded) {
      this._loadData(this.activeTab, false);
    }
  }

  private _loadData(tab: AttendeeTab, initial: boolean) {
    let interest = !!this.interest ? this.interest : null;
    if (initial) {
      this.attendeeService.loadInitial(tab, this.eventId, interest);
    } else {
      this.attendeeService.loadMore(tab, this.eventId, interest);
    }

  }

}

enum AttendeeTab {
  Going = 1,
  Maybe = 2,
  NotGoing = 3
}
