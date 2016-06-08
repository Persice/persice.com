import {Injectable, provide} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {Store} from '@ngrx/store';

import {HttpClient} from '../../app/shared/core';
import {NewConnectionsCounterActions} from '../actions';
import {AppState, getNewConnectionsCounterState} from '../reducers';

@Injectable()
export class NewConnectionsCounterService {
  static API_URL = '/api/v2/new_connections/counter/';
  public counter$: Observable<number>;

  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private actions: NewConnectionsCounterActions
  ) {
    const store$ = store.let(getNewConnectionsCounterState());
    this.counter$ = store$.map(state => state['counter']);
  }

  public refresh(): void {
    let url = `${NewConnectionsCounterService.API_URL}?format=json`;

    let subs: Subscription = this.http.get(url)
      .map((res) => res.json())
      .subscribe((dto: any) => {
        if (dto.meta.total_count === 1) {
          let counter = dto.objects[0].new_connection_counter;
          this.store.dispatch(this.actions.loadCounterSuccess(counter));
          subs.unsubscribe();
        }
      });
  }

  public increase(): void {
    this.store.dispatch(this.actions.increaseCounter());
  }
}

export var newConnectionsCounterServiceInjectables: any[] = [
  provide(NewConnectionsCounterService, { useClass: NewConnectionsCounterService })
];
