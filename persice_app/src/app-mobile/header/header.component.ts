import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router-deprecated';

import {CookieUtil} from '../../app/shared/core';
import {PageTitleComponent} from './page-title';
import {PageTitleConversationsComponent} from './page-title-conversations';
import {OpenLeftMenuDirective} from '../shared/directives';
import {AppStateService} from '../shared/services';

// List of possible actions when clicking on buttons in header
export enum HeaderActions {
  FiltersOpen,
  FiltersGo,
  NewConversation,
  EditMyProfile,
  MyProfile,
  EditPhotos,
  ChooseAlbum,
  ChoosePhoto,
  SaveCroppedPhoto,
  EditPersonalInfo,
  None
}

// State for keeping record which button is visible on the left side of header
export enum LeftHeaderState {
  Menu,
  Back,
  Cancel
}

// State for keeping record which button is visible on the right side of header
export enum RightHeaderState {
  Add,
  Send,
  Search,
  Go,
  Edit,
  Done,
  None
}

// State for keeping record what content is visible in the center section of header
export enum CenterHeaderState {
  Title,
  FiltersTabs,
  ConversationsTitleWithCounter,
  None
}

@Component({
  selector: 'prs-mobile-header',
  template: require('./header.html'),
  directives: [
    PageTitleComponent,
    PageTitleConversationsComponent,
    OpenLeftMenuDirective,
    RouterLink
  ]
})
export class HeaderComponent implements OnInit {
  public actions = HeaderActions;
  public leftState = LeftHeaderState;
  public centerState = CenterHeaderState;
  public rightState = RightHeaderState;

  // Header state with default values
  public headerState = {
    left: this.leftState.Menu,
    leftAction: this.actions.None,
    center: this.centerState.Title,
    right: this.rightState.None,
    rightAction: this.actions.None,
    transparent: false,
    title: 'Persice'
  };

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
  }


  public onLeftButtonClick(event: MouseEvent) {

  }


  public onAction(actionType: number) {
    switch (actionType) {
      case this.actions.FiltersOpen:
        console.log('Opening filters');
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
        this.appStateService.setEditPhotosState({page: 1});
        break;

       case this.actions.ChooseAlbum:
        this.appStateService.setEditPhotosState({page: 2});
        break;

      case this.actions.ChoosePhoto:
        this.appStateService.setEditPhotosState({page: 3});
        break;

      case this.actions.SaveCroppedPhoto:
        this.appStateService.setEditPhotosState({page: 1, savePhotoAndRefresh: true});
        break;


      default:
        // code...
        break;
    }
  }

}
