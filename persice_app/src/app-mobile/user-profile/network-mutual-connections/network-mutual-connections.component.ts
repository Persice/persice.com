import { Component, OnInit, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserCardMobileComponent } from '../../shared/components/user-card';
import { UserCardSocialMobileComponent } from '../../shared/components/user-card-social';
import { LoadingComponent } from '../../../app/shared/components/loading';
import { InfiniteScrollDirective } from '../../../common/directives';
import { MutualConnectionsService } from './mutual-connections.service';
import { SelectedPersonActions } from '../../../common/actions';
import { AppState } from '../../../common/reducers';
import { AppStateService } from '../../shared/services';
import { HeaderState } from '../../header';
import { Person } from '../../shared/model/person';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'prs-mobile-network-mutual-connections',
  template: <any>require('./network-mutual-connections.html'),
  directives: [
    LoadingComponent,
    UserCardMobileComponent,
    UserCardSocialMobileComponent,
    InfiniteScrollDirective
  ],
  providers: [MutualConnectionsService]
})
export class NetworkMutualConnectionsComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() set person(data: Person) {
    this.name = data.firstName;
    this.userId = data.id;
  };

  public mutual$: Observable<Person[]>;
  public mutualTotalCount$: Observable<number>;
  public others$: Observable<Person[]>;
  public othersTotalCount$: Observable<number>;

  private isLoading$: Observable<boolean>;
  private isLoadedSub: Subscription;
  private isLoaded: boolean = false;
  private name: string = '';
  private userId: string;

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private actions: SelectedPersonActions,
    private mutualConnectionsService: MutualConnectionsService,
    private appStateService: AppStateService,
    private headerState: HeaderState
  ) {

  }

  ngOnInit(): any {
    document.querySelector('html').classList.toggle('bg-gray-3');
    const pageTitle: string = `${this.name}'s network`;
    this.appStateService.headerStateEmitter.emit(
      this.headerState.backWithTitle(pageTitle, HeaderState.actions.ShowUserProfile)
    );

    this.isLoading$ = this.mutualConnectionsService.isLoading$;

    this.isLoadedSub = this.mutualConnectionsService.isLoaded$.subscribe((state: boolean) => {
      this.isLoaded = state;
    });

    this.mutual$ = this.mutualConnectionsService.connections$.map(data => data.mutual);
    this.mutualTotalCount$ = this.mutualConnectionsService.connections$.map(data => data.mutualTotalCount);
    this.others$ = this.mutualConnectionsService.connections$.map(data => data.others);
    this.othersTotalCount$ = this.mutualConnectionsService.connections$.map(data => data.othersTotalCount);

    // Start inital loading of mutual connections
    this._loadData(true);
  }

  ngAfterViewInit(): any {
    setTimeout(() => {
      window.scrollTo(0, 0);
    });
  }

  ngOnDestroy(): any {
    document.querySelector('html').classList.toggle('bg-gray-3');
    if (this.isLoadedSub) {
      this.isLoadedSub.unsubscribe();
    }
  }

  public viewProfile(person: Person) {
    this.router.navigateByUrl('/' + person.username);
  }

  public openNewConversation(person: Person) {
    this.store.dispatch(this.actions.set(person, 'connection'));
    this.router.navigateByUrl('/messages/new');
  }

  public loadMoreData(event: MouseEvent) {
    if (!this.isLoaded) {
      this._loadData(false);
    }
  }

  private _loadData(initial: boolean) {
    if (initial) {
      this.mutualConnectionsService.loadInitial(this.userId);
    } else {
      this.mutualConnectionsService.loadMore(this.userId);
    }

  }

}

