import {Component, Input, Output, EventEmitter, OnInit}
from '@angular/core';
import {Router} from '@angular/router-deprecated';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs';

import {UserCardMobileComponent} from '../../shared/components/user-card';
import {CheckImageDirective} from '../../../app/shared/directives';
import {LoadingComponent} from '../../../app/shared/components/loading';
import {InfiniteScrollDirective} from '../../../common/directives';
import {ConnectionsService} from '../../../common/connections';
import {SelectedPersonActions} from '../../../common/actions';
import {AppState} from '../../../common/reducers';
import {AppStateService} from '../../shared/services';
import {HeaderState} from '../../header';

@Component({
  selector: 'prs-mobile-network',
  template: require('./network.html'),
  directives: [
    CheckImageDirective,
    LoadingComponent,
    UserCardMobileComponent,
    InfiniteScrollDirective
  ],
  providers: [ConnectionsService]
})
export class NetworkComponent implements OnInit {
  @Input() type: string;
  @Input() name: string = '';

  // Mutual connections
  @Input() mutualConnectionsCount: number = 0;
  @Input() connectionsMutualPersice: any[] = [];
  @Input() connectionsMutualFacebook: any[] = [];
  @Input() connectionsMutualLinkedin: any[] = [];
  @Input() connectionsMutualTwitterFollowers: any[] = [];
  @Input() connectionsMutualTwitterFriends: any[] = [];

  public connections: Array<any> = [];
  public connectionsCount: number = 0;
  public loadingConnections: boolean = false;
  public loadingConnectionsInitial: boolean = false;
  public connectionsNext: string = '';

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private actions: SelectedPersonActions,
    private connectionsService: ConnectionsService,
    private appStateService: AppStateService,
    private headerState: HeaderState
  ) {

  }

  ngOnInit(): any {

    const pageTitle: string = `${this.name}'s network`;
    this.appStateService.headerStateEmitter.emit(
      this.headerState.backWithTitle(pageTitle, HeaderState.actions.ShowUserProfile)
    );

    if (this.type === 'my-profile') {
      this.getConnections();
    }
  }

  /**
  * Load connections from backend
  */
  public getConnections() {
    if (this.loadingConnections) {
      return;
    }

    if (this.connectionsNext === null) return;
    this.loadingConnections = true;

    if (this.connectionsNext === '') {
      this.loadingConnectionsInitial = true;
    }

    let subs: Subscription = this.connectionsService.get(this.connectionsNext, 12, false)
      .subscribe(
      (data: any) => {
        this.assignConnectionsList(data);
        this.loadingConnections = false;
        this.loadingConnectionsInitial = false;
        subs.unsubscribe();
      },
      (err) => {
        this.loadingConnections = false;
        this.loadingConnectionsInitial = false;
        subs.unsubscribe();
      });
  }

  /**
  * Load more connections from backend
  * @param {MouseEvent} event
  */
  public loadMoreConnections(event: MouseEvent) {
    if (this.connectionsNext && !this.loadingConnections) {
      this.getConnections();
    }
  }

  public openNewConversationFromConnections(id: string): void {
    for (var i = this.connections.length - 1; i >= 0; i--) {
      if (this.connections[i].id === id) {
        this.openNewConversation(this.connections[i]);
      }
    }
  }

  public openNewConversationFromMutualConnections(data: any): void {
    // Prepare data for putting selectedPerson, it must have first_name, image and id
    const person: Object = {
      first_name: data.first_name,
      image: data.image,
      id: data.user_id
    };
    this.openNewConversation(person);
  }

  private openNewConversation(person: any): void {
    this.store.dispatch(this.actions.set(person, 'connection'));
    this.store.dispatch(this.actions.useAsNewConversationRecipient());
    this.router.navigate(['Messages', 'NewConversation']);
  }

  private assignConnectionsList(data: any) {
    this.connectionsCount = data.meta.total_count;
    if (this.connections.length > 0) {
      let more = data.objects;
      for (var i = 0; i <= more.length - 1; i++) {
        this.connections = [...this.connections, more[i]];
      }
    } else {
      this.connections = data.objects;
    }
    this.connectionsNext = data.meta.next;
  }
}