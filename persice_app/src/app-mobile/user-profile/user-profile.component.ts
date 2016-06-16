import {Component, Input, Output, EventEmitter, AfterViewInit} from '@angular/core';
import {RouterLink} from '@angular/router-deprecated';
import {Subscription} from 'rxjs';

import {OpenLeftMenuDirective} from '../shared/directives';
import {DROPDOWN_DIRECTIVES} from '../../common/directives/dropdown';
import {RemodalDirective} from '../../app/shared/directives';

import {GenderPipe} from '../../app/shared/pipes';
import {CheckImageDirective} from '../../app/shared/directives';
import {Person} from '../shared/model';
import {AboutMobileComponent} from './about';
import {PhotosMobileComponent} from './photos';
import {NetworkPreviewComponent} from './network-preview';
import {NetworkComponent} from './network';
import {ItemsListMobileComponent} from './items-list';

import {AppStateService} from '../shared/services';
import {LikesMobileComponent} from './likes/likes-mobile.component';
import {FriendService} from '../../app/shared/services';

enum ViewsType {
  Profile,
  Photos,
  Network,
  Likes
}

@Component({
  selector: 'prs-user-profile',
  template: require('./user-profile.html'),
  pipes: [GenderPipe],
  directives: [
    CheckImageDirective,
    DROPDOWN_DIRECTIVES,
    RemodalDirective,
    AboutMobileComponent,
    ItemsListMobileComponent,
    NetworkPreviewComponent,
    NetworkComponent,
    OpenLeftMenuDirective,
    RouterLink,
    PhotosMobileComponent,
    LikesMobileComponent
  ],
  providers: [FriendService]
})
export class UserProfileComponent implements AfterViewInit {
  // Profile type, crowd or connection
  @Input() type: string;

  @Input() username: string;

  // When [user] from Input property change, set internal state for our component
  @Input() set user(value) {
    // If value is defined, set person
    if (value) {
      this._setState(value);
    }
  }
  @Output() onCloseProfile: EventEmitter<any> = new EventEmitter();
  @Output() onDisconnectProfile: EventEmitter<any> = new EventEmitter();

  // Indicator for active view
  public activeView = ViewsType.Profile;
  public viewsType = ViewsType;

  // Person object which is displayed in the component template
  public person: Person;

  // Boolean flag which controls whether full profile information is collapsed and visible
  public profileExtraInfoVisible: boolean = false;

  // Indicator for which tab is active: interests(0), goals(1), offers(2)
  public activeTab: number = 0;

  // Boolean flag which checks if dropdown menu is opened
  public isDropdownOpen: boolean = false;

  // Remodal option
  public modalOptions = JSON.stringify({
    hashTracking: true,
    closeOnOutsideClick: true
  });

  constructor(private appStateService: AppStateService, private friendService: FriendService) { }

  ngAfterViewInit() {
    setTimeout(() => {
      window.scrollTo(0, 0);
    });
  }

  /**
   * Disconnects a connection
   * @param {MouseEvent} event
   */
  public disconnect(event: MouseEvent) {
     let subs: Subscription = this.friendService.disconnect(this.person.id)
        .subscribe((data: any) => {
          this.onDisconnectProfile.emit(this.person.id);
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
    if (this.person.connectionsCount < 1) {
      // Do nothing.
      return;
    }

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
    if (this.type !== 'my-profile') {
      this.toggleFooterVisibility(true);
    }
  }

  private toggleFooterVisibility(visible: boolean): void {
    this.appStateService.setProfileFooterVisibility({
      visibility: visible,
      type: this.type
    });
  }

  private _setState(value: any) {
    this.person = new Person(value);
  }

}
