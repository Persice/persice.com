import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router-deprecated';

import {CookieUtil} from '../../app/shared/core';
import {PageTitleComponent} from './page-title';
import {PageTitleConversationsComponent} from './page-title-conversations';
import {OpenLeftMenuDirective} from '../shared/directives';
import {AppStateService} from '../shared/services';
import {HeaderState} from './header.state';
import {DROPDOWN_DIRECTIVES} from '../../common/directives/dropdown';

@Component({
  selector: 'prs-mobile-header',
  template: require('./header.html'),
  directives: [
    PageTitleComponent,
    PageTitleConversationsComponent,
    OpenLeftMenuDirective,
    DROPDOWN_DIRECTIVES
  ]
})
export class HeaderComponent implements OnInit {
  public isHeaderVisible: boolean = true;
  public actions = HeaderState.actions;
  public leftState = HeaderState.left;
  public centerState = HeaderState.center;
  public rightState = HeaderState.right;

  // Header state set with inital values
  public headerState = HeaderState.initial;

  public username = CookieUtil.getValue('user_username');

  constructor(private router: Router, private appStateService: AppStateService) { }

  ngOnInit(): any {
    this.router.subscribe((next: any) => {
      const state: any = next.instruction.routeData.data;
      this.headerState = Object.assign({}, this.headerState, state.headerState);
      console.log('changing header state via ROUTER');
      console.log(state);
      console.log(this.headerState);

    });

    this.appStateService.headerStateEmitter.subscribe((state: any) => {
      console.log('changing header state via SERVICE');
      console.log('changing header state', state);
      this.headerState = Object.assign({}, this.headerState, state);
    });

    this.appStateService.isHeaderVisibleEmitter.subscribe((visible: boolean) => {
      this.isHeaderVisible = visible;
    });
  }

  public onAction(actionType: number) {
    switch (actionType) {
      case this.actions.FiltersOpen:
        this.isHeaderVisible = false;
        this.appStateService.setFilterVisibility(true);
        break;

      case this.actions.NewConversation:
        this.router.navigate(['Messages', 'NewConversation']);
        break;

      case this.actions.EditMyProfile:
        this.router.navigate(['EditMyProfile', { username: this.username }]);
        break;

      case this.actions.MyProfile:
        this.router.navigate(['MyProfile', { username: this.username }]);
        break;

      case this.actions.EditPersonalInfo:
        this.router.navigate(['EditMyProfile', { username: this.username }, 'EditPersonalInfo']);
        break;

      case this.actions.EditPhotos:
        this.appStateService.setEditPhotosState({ page: 1 });
        break;

      case this.actions.ChooseAlbum:
        this.appStateService.setEditPhotosState({ page: 2 });
        break;

      case this.actions.ChoosePhoto:
        this.appStateService.setEditPhotosState({ page: 3 });
        break;

      case this.actions.SaveCroppedPhoto:
        this.appStateService.setEditPhotosState({ page: 1, savePhotoAndRefresh: true });
        break;

      case this.actions.ShowUserProfile:
        this.appStateService.setUserProfileVisibility(true);
        break;

      case this.actions.BackToListView:
        this.appStateService.goBackToListViewEmitter.emit(true);
        break;

      default:
        break;
    }
  }

}
