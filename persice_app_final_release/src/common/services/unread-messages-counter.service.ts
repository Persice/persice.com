import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { HttpClient } from '../core';
import { AppState, getUnreadMessagesCounterState } from '../reducers';
import { UnreadMessagesCounterActions } from '../actions';

@Injectable()
export class UnreadMessagesCounterService {
  static API_URL = '/api/v1/inbox/unread_counter/';
  public counter$: Observable<number>;

  constructor(private http: HttpClient, private store: Store<AppState>, private actions: UnreadMessagesCounterActions) {
    const store$ = store.let(getUnreadMessagesCounterState());
    this.counter$ = store$.map(state => state[ 'counter' ]);
  }

  public refresh(): void {
    let url = `${UnreadMessagesCounterService.API_URL}?format=json`;

    let subs: Subscription = this.http.get(url)
      .map((res) => res.json())
      .subscribe((dto: any) => {
        if (dto.meta.total_count === 1) {
          let counter = dto.objects[ 0 ].unread_counter;
          this.store.dispatch(this.actions.loadCounterSuccess(counter));
          subs.unsubscribe();
        }
      });
  }

  public increase(): void {
    this.store.dispatch(this.actions.increaseCounter());
  }
}

