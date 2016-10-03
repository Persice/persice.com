import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MutualConnectionsService } from './mutual-connections.service';
import { HeaderState } from '../../header';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Person } from '../../../../common/models/person';
import { AppState } from '../../../../common/reducers';
import { SelectedPersonActions } from '../../../../common/actions';
import { AppStateService } from '../../../shared/services';

@Component({
  selector: 'prs-mobile-network-mutual-connections',
  templateUrl: './network-mutual-connections.html',
  providers: [ MutualConnectionsService ]
})
export class NetworkMutualConnectionsComponent implements OnInit,  OnDestroy {
  @Input() set person(data: Person) {
    this.name = data.firstName;
    this.userId = data.id;
  };

  public mutual$: Observable<Person[]>;
  public mutualTotalCount$: Observable<number>;
  public others$: Observable<Person[]>;
  public othersTotalCount$: Observable<number>;

  public isLoading$: Observable<boolean>;
  public isLoaded: boolean = false;

  private isLoadedSub: Subscription;
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

