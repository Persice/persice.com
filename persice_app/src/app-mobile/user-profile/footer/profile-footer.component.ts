import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { SelectedPersonActions } from '../../../common/actions';
import { AppState, getSelectedPersonState } from '../../../common/reducers';
import { AppStateService } from '../../shared/services';

@Component({
  selector: 'prs-mobile-profile-footer',
  template: <any>require('./profile-footer.html'),
  directives: [ROUTER_DIRECTIVES]
})
export class ProfileFooterMobileComponent implements OnInit {
  private selectedPersonState$: Observable<any>;

  private type: string = '';
  private score: number = 0;
  private connected: boolean;

  private passIsActive = false;
  private acceptIsActive = false;
  private timeoutPass;
  private timeoutAccept;
  private isVisible: boolean = false;

  constructor(
    private store: Store<AppState>,
    private actions: SelectedPersonActions,
    private appStateService: AppStateService
  ) {
    this.selectedPersonState$ = store.let(getSelectedPersonState());
    this.selectedPersonState$.subscribe((state: any) => {
      this.score = state.person.score;
      this.type = state.type;
      this.connected = state.connected;
    });
  }

  ngOnInit() {
    this.appStateService.isProfileFooterVisibleEmitter
      .subscribe((state: any) => {
        this.isVisible = state.visibility;
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
      this.passIsActive = false;
      if (this.isVisible) {
        this.store.dispatch(this.actions.passed());
      }

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
      this.acceptIsActive = false;
      if (this.isVisible) {
        this.store.dispatch(this.actions.accepted());
      }
    }, 1500);
  }
}
