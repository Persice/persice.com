import {Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';

import {
  AppState,
  getConversationsState
} from '../../../common/reducers';

@Component({
  selector: 'prs-page-title-conversations',
  template: `
  <h2 class="mob-header__title">
    <span class="mob-header__title-value">Conversations</span>
    <span>({{counter$ | async}})</span>
  </h2>
  `
})
export class PageTitleConversationsComponent {
   public counter$: Observable<number>;

   constructor(private store: Store<AppState>) {
     const conversationsStore$ = store.let(getConversationsState());
     this.counter$ = conversationsStore$.map(state => state['count']);
   }

}
