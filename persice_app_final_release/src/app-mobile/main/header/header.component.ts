import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { HeaderState } from './header.state';
import { Store } from '@ngrx/store';
import { TokenUtil } from '../../../common/core/util';
import { AppStateService } from '../../shared/services/app-state.service';
import { AppState, getUnreadMessagesCounterState, getNewConnectionsCounterState } from '../../../common/reducers/index';

@Component({
  selector: 'prs-mobile-header',
  templateUrl: './header.html'
})
export class HeaderComponent implements OnInit {
  public isHeaderVisible: boolean = true;
  public actions = HeaderState.actions;
  public leftState = HeaderState.left;
  public centerState = HeaderState.center;
  public rightState = HeaderState.right;

  unreadMessagesCounter: number;
  newConnectionsCounter: number;

  // Header state set with inital values
  public headerState = HeaderState.initial;

  public username = TokenUtil.getValue('username');

  constructor(
    private router: Router,
    private location: Location,
    private appStateService: AppStateService,
    private store: Store<AppState>
  ) {
    const unreadMessagesCounterStore$ = store.let(getUnreadMessagesCounterState());
    unreadMessagesCounterStore$.map(state => state[ 'counter' ]).subscribe((count) => {
      this.unreadMessagesCounter = count;
    });

    const newConnectionsCounterStore$ = store.let(getNewConnectionsCounterState());
    newConnectionsCounterStore$.map(state => state[ 'counter' ]).subscribe((count) => {
      this.newConnectionsCounter = count;
    });
  }

  ngOnInit(): any {
    this.appStateService.headerStateEmitter.subscribe((state: any) => {
      this.headerState = Object.assign({}, this.headerState, state);
    });

    this.appStateService.isHeaderVisibleEmitter.subscribe((visible: boolean) => {
      this.isHeaderVisible = visible;
    });
  }

  public onAction(actionType: any) {
    switch (actionType) {
      case this.actions.FiltersOpen:
        this.isHeaderVisible = false;
        this.appStateService.setFilterVisibility(true);
        break;

      case this.actions.NewConversation:
        this.router.navigateByUrl('/messages/new');
        break;

      case this.actions.EditMyProfile:
        this.router.navigateByUrl('/edit-profile');
        break;

      case this.actions.MyProfile:
        this.router.navigateByUrl(`/${this.username}`);
        break;

      case this.actions.EditPersonalInfo:
        this.router.navigateByUrl('/edit-profile/personal');
        break;

      case this.actions.Conversations:
        this.router.navigateByUrl('/messages');
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

      case this.actions.SendMessage:
        this.appStateService.sendMessageEmitter.emit(undefined);
        break;

      case this.actions.SaveCroppedPhoto:
        this.appStateService.setEditPhotosState({ page: 1, savePhotoAndRefresh: true });
        break;

      case this.actions.ShowUserProfile:
        this.appStateService.setUserProfileVisibility(true);
        break;

      case this.actions.BackToListView:
        // Emit event before going back, so subscriber can do some action before actual
        // back is triggered
        this.appStateService.backEmitter.emit(undefined);
        this.appStateService.goBackToListViewEmitter.emit(true);
        break;

      case this.actions.Back:
        // Emit event before going back, so subscriber can do some action before actual
        // back is triggered
        this.appStateService.backEmitter.emit(undefined);
        this.location.back();
        break;

      default:
        break;
    }
  }

}
