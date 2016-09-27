import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

@Injectable()
export class NewConnectionsCounterActions {

  public static LOAD_COUNTER_SUCCESS = '[New Connections Counter] Load Counter Success';
  public static INCREASE_COUNTER = '[New Connections Counter] Increase Counter';

  public loadCounterSuccess(data: number): Action {
    return {
      type: NewConnectionsCounterActions.LOAD_COUNTER_SUCCESS,
      payload: { counter: data }
    };
  }

  public increaseCounter(): Action {
    return {
      type: NewConnectionsCounterActions.INCREASE_COUNTER,
      payload: {}
    };
  }

}
