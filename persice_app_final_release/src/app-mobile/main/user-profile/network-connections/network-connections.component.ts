import { Component, Input, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { HeaderState } from '../../header';
import { ConnectionsService } from '../../../../common/connections';
import { AppState } from '../../../../common/reducers';
import { SelectedPersonActions } from '../../../../common/actions';
import { AppStateService } from '../../../shared/services';

@Component({
  selector: 'prs-mobile-network-connections',
  templateUrl: './network-connections.html',
  providers: [ ConnectionsService ]
})
export class NetworkConnectionsComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() name: string = '';

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
    document.querySelector('html').classList.toggle('bg-gray-3');
    const pageTitle: string = `${this.name}'s network`;
    this.appStateService.headerStateEmitter.emit(
      this.headerState.backWithTitle(pageTitle, HeaderState.actions.ShowUserProfile)
    );

    this.getConnections();

  }

  ngAfterViewInit(): any {
    setTimeout(() => {
      window.scrollTo(0, 0);
    });
  }

  ngOnDestroy(): any {
    document.querySelector('html').classList.toggle('bg-gray-3');
  }

  public viewProfile(person) {
    this.router.navigateByUrl('/' + person.username);
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

  public openNewConversationFromMutualConnections(data: any): void {
    // Prepare data for putting selectedPerson, it must have first_name, image and id
    const person: Object = {
      firstName: data.first_name,
      image: data.image,
      id: data.user_id
    };
    this.openNewConversation(person);
  }

  private openNewConversation(person: any): void {
    this.store.dispatch(this.actions.set(person, 'connection'));
    this.router.navigateByUrl('/messages/new');
  }

  private assignConnectionsList(data: any) {
    this.connectionsCount = data.meta.total_count;
    if (this.connections.length > 0) {
      let more = data.objects;
      for (var i = 0; i <= more.length - 1; i++) {
        this.connections = [ ...this.connections, more[ i ] ];
      }
    } else {
      this.connections = data.objects;
    }
    this.connectionsNext = data.meta.next;
  }
}
