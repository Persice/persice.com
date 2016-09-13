import { Component, Input, OnInit, OnDestroy, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Location } from '@angular/common';
import { OpenLeftMenuDirective } from '../shared/directives';
import { RemodalDirective, CheckImageDirective } from '../../app/shared/directives';
import { GenderPipe } from '../../app/shared/pipes';
import { Person } from '../../common/models/person/index';
import { AboutMobileComponent } from './about';
import { PhotosMobileComponent } from './photos';
import { NetworkPreviewComponent } from './network-preview';
import { NetworkConnectionsComponent } from './network-connections';
import {
  NetworkMutualConnectionsComponent,
  MutualConnectionsService,
  MutualConnectionsCountService
} from './network-mutual-connections';
import { ItemsListMobileComponent } from './items-list';
import { AppStateService } from '../shared/services';
import { LikesMobileComponent } from './likes/likes-mobile.component';
import { FriendService } from '../../app/shared/services';
import { ConnectionsService } from '../../common/connections';
import { HeaderState } from '../header';
import { AppState, getSelectedPersonState } from '../../common/reducers';
import { Store } from '@ngrx/store';
import { SelectedPersonActions } from '../../common/actions';

enum ViewsType {
  Profile,
  Photos,
  Network,
  Likes
}

@Component({
  selector: 'prs-user-profile',
  template: <any>require('./user-profile.html'),
  pipes: [GenderPipe],
  directives: [
    CheckImageDirective,
    RemodalDirective,
    AboutMobileComponent,
    ItemsListMobileComponent,
    NetworkPreviewComponent,
    NetworkConnectionsComponent,
    NetworkMutualConnectionsComponent,
    OpenLeftMenuDirective,
    PhotosMobileComponent,
    LikesMobileComponent
  ],
  providers: [
    FriendService,
    ConnectionsService,
    MutualConnectionsService,
    MutualConnectionsCountService
  ]
})
export class UserProfileComponent implements AfterViewInit, OnInit, OnDestroy {
  // Profile type, crowd or connection
  @Input() type: string;

  @Input() username: string;

  @Input() isStandalonePage: boolean = false;

  // When [user] from Input property change, set internal state for our component
  @Input() set user(value) {
    // If value is defined, set person
    if (value) {
      this._setState(value);
    }
  }

  @Output() profileClosedAfterActionEvent: EventEmitter<any> = new EventEmitter;

  // Indicator for active view
  public activeView = ViewsType.Profile;
  public viewsType = ViewsType;

  // Person object which is displayed in the component template
  public person: Person;

  // Boolean flag which controls whether full profile information is collapsed and visible
  public profileExtraInfoVisible: boolean = false;

  // Indicator for which tab is active: interests(0), goals(1), offers(2)
  public activeTab: number = 0;

  // Boolean flag which checks if dimmed overlay over user profile is visible
  public isOverlayVisible: boolean = false;

  // Remodal option
  public modalOptions = JSON.stringify({
    hashTracking: false,
    closeOnOutsideClick: true
  });

  // List for previewing connections
  public connectionsPreview: Observable<any[]>;
  public connectionsPreviewTotalCount: Observable<number>;
  public mutualConnectionsPreviewTotalCount: Observable<number>;

  private isUserProfileVisibleSubs;
  private backSubs;

  private accepted$: Observable<boolean>;
  private passed$: Observable<boolean>;
  private acceptSub: Subscription;
  private passSub: Subscription;

  constructor(
    private appStateService: AppStateService,
    private friendService: FriendService,
    private connectionsService: ConnectionsService,
    private mutualConnectionsService: MutualConnectionsService,
    private mutualConnectionsCountService: MutualConnectionsCountService,
    private store: Store<AppState>,
    private actions: SelectedPersonActions,
    private location: Location
  ) {
    const store$ = store.let(getSelectedPersonState());
    this.accepted$ = store$.map((data) => data['accept']);
    this.passed$ = store$.map((data) => data['pass']);

    this.acceptSub = this.accepted$.subscribe((status: boolean) => {
      if (!!status) {
        this._saveFriendshipStatus(0);
      }
    });

    this.passSub = this.passed$.subscribe((status: boolean) => {
      if (!!status) {
        this._saveFriendshipStatus(-1);
      }

    });

  }

  ngOnInit(): any {
    document.querySelector('html').classList.toggle('bg-gray');
    this.isUserProfileVisibleSubs = this.appStateService.isUserProfileVisibleEmitter.subscribe((visible: boolean) => {
      if (!!visible) {
        this.showProfileView(undefined);
      }
    });

    // When going back from profile view, hide footer and clear selected person from Store
    this.backSubs = this.appStateService.backEmitter.subscribe(() => {
      this.toggleFooterVisibility(false);
      this.clearSelectedPersonFromStore();
    });

  }

  ngOnDestroy(): any {
    document.querySelector('html').classList.toggle('bg-gray');
    this.toggleFooterVisibility(false);
    this.isUserProfileVisibleSubs.unsubscribe();
    this.backSubs.unsubscribe();
    this.acceptSub.unsubscribe();
    this.passSub.unsubscribe();
  }

  clearSelectedPersonFromStore() {
    // Clear selected person from SelectedPerson App Store
    this.store.dispatch(this.actions.clear());
  }

  ngAfterViewInit() {
    setTimeout(() => {
      window.scrollTo(0, 0);
    });
  }

  public makeProfileHeaderVisible() {
    if (this.type === 'my-profile') {
      this.appStateService.headerStateEmitter.emit(HeaderState.myProfile);
    }

    if (this.type === 'crowd') {
      this.appStateService.headerStateEmitter.emit(HeaderState.crowdProfile);
    }

    if (this.type === 'connection') {
      this.appStateService.headerStateEmitter.emit(HeaderState.connectionProfile);
    }

    if (this.isStandalonePage) {
      if (!!this.person.connected) {
        this.appStateService.headerStateEmitter.emit(HeaderState.userProfileWithMenu);
      } else {
        this.appStateService.headerStateEmitter.emit(HeaderState.userProfile);
      }
    }
  }

  /**
   * Disconnects a connection
   * @param {MouseEvent} event
   */
  public disconnect(event: MouseEvent) {
    let subs: Subscription = this.friendService.disconnect(this.person.id)
      .subscribe((data: any) => {
        this.closeView();
        subs.unsubscribe();
      }, (err) => {
        subs.unsubscribe();
      });
  }

  public toggleProfileExtraInfoVisibility(event) {
    this.profileExtraInfoVisible = !this.profileExtraInfoVisible;
  }

  /**
   * Activate interests, goals or offers tab
   * @param {number} tab active tab: interests(0), goals(1), offers(2)
   */
  public activateTab(tab: number) {
    this.activeTab = tab;
  }

  public showNetworkView(event): void {
    this.activeView = this.viewsType.Network;
    this.toggleFooterVisibility(false);
  }

  public showPhotosView(event): void {
    this.activeView = this.viewsType.Photos;
    this.toggleFooterVisibility(false);
  }

  public showLikesView(event): void {
    if (this.person.likesCount + this.person.likesMutualCount < 1) {
      // Do nothing.
      return;
    }

    this.activeView = this.viewsType.Likes;
    this.toggleFooterVisibility(false);
  }

  public showProfileView(event: any): void {
    this.activeView = this.viewsType.Profile;
    if (this.type === 'crowd' || this.type === 'connection') {
      this.toggleFooterVisibility(true);
    }

    this.makeProfileHeaderVisible();

  }

  private toggleFooterVisibility(visible: boolean): void {
    this.appStateService.setProfileFooterVisibility({
      visibility: visible
    });
  }

  private _setState(user: any) {
    this.person = new Person(user);

    if (this.type !== 'my-profile') {
      this.connectionsPreview = this.mutualConnectionsService.preview$.map(data => data.connections);
      this.connectionsPreviewTotalCount = this.mutualConnectionsService.preview$.map(data => data.connectionsTotalCount);
      this.mutualConnectionsPreviewTotalCount = this.mutualConnectionsCountService.totalCount$;

      // Set selected user only if profile is crowd or connection
      this.store.dispatch(this.actions.set(this.person, this.type));
      this.mutualConnectionsService.getForPreview(this.person.id, 4);
      this.mutualConnectionsCountService.getTotalCount(this.person.id);
      this.toggleFooterVisibility(true);

      if (this.username) {
        this.setBrowserLocationUrl(`/${this.username}`);
      } else if (user.username) {
        this.setBrowserLocationUrl(`/${user.username}`);
      }

    } else {
      this.connectionsPreview = this.connectionsService.connections$.map(data => data.connections);
      this.connectionsPreviewTotalCount = this.connectionsService.connections$.map(data => data.connectionsTotalCount);
      this.connectionsService.getForPreview(4);
    }

    this.makeProfileHeaderVisible();
    this.activeView = this.viewsType.Profile;
  }

  private setBrowserLocationUrl(path: string) {
    if (!this.isStandalonePage) {
      window.history.pushState('', '', `${path}`);
    }
  }

  private _saveFriendshipStatus(status: number): void {
    if (!!this.person) {
      const id: string = this.person.id;
      this.friendService.saveFriendship(status, id)
        .subscribe(data => {
          this.closeView();
        }, (err) => {
          this.closeView();
        });
    }
  }

  private closeView() {
    this.toggleFooterVisibility(false);
    this.clearSelectedPersonFromStore();
    if (this.isStandalonePage) {
      setTimeout(() => this.location.back(), 200);
    } else {
      this.profileClosedAfterActionEvent.emit(this.person.id);
    }
  }
}
