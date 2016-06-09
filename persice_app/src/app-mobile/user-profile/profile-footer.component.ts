import {Component, ChangeDetectionStrategy} from '@angular/core';
import {Observable} from 'rxjs';
import {Router} from '@angular/router-deprecated';
import {Store} from '@ngrx/store';

import {SelectedPersonActions} from '../../common/actions';
import {AppState, getSelectedPersonState} from '../../common/reducers';

@Component({
  selector: 'prs-mobile-profile-footer',
  template: require('./profile-footer.html'),
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileFooterMobileComponent {
  private selectedPersonState$: Observable<any>;

  private type: string = '';
  private score: number = 0;
  private connected: boolean;

  private passIsActive = false;
  private acceptIsActive = false;
  private timeoutPass;
  private timeoutAccept;

  constructor(
    private _router: Router,
    private store: Store<AppState>,
    private actions: SelectedPersonActions
  ) {
    this.selectedPersonState$ = store.let(getSelectedPersonState());
    this.selectedPersonState$.subscribe((state: any) => {
      this.score = state.person.score;
      this.type = state.type;
      this.connected = state.connected;
    });
  }

  pass(event) {
    this.acceptIsActive = false;
    if (this.timeoutAccept) {
      window.clearTimeout(this.timeoutAccept);
    }

    if (this.passIsActive) {
      return;
    }
    this.passIsActive = true;
    if (this.timeoutPass) {
      window.clearTimeout(this.timeoutPass);
    }
    this.timeoutPass = setTimeout(() => {
      this.store.dispatch(this.actions.passed());
    }, 1500);

  }

  accept(event) {
    this.passIsActive = false;
    if (this.timeoutPass) {
      window.clearTimeout(this.timeoutPass);
    }
    if (this.acceptIsActive) {
      return;
    }
    this.acceptIsActive = true;
    if (this.timeoutAccept) {
      window.clearTimeout(this.timeoutAccept);
    }
    this.timeoutAccept = setTimeout(() => {
      this.store.dispatch(this.actions.accepted());
    }, 1500);
  }

  openNewConversation(event: MouseEvent): void {
    this.store.dispatch(this.actions.useAsNewConversationRecipient());
    this._router.navigate(['Messages', 'NewConversation']);
  }
}
