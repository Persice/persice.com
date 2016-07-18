import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

@Injectable()
export class UnreadMessagesCounterActions {

  public static LOAD_COUNTER_SUCCESS = '[Unread Messages Counter] Load Counter Success';
  public static INCREASE_COUNTER = '[Unread Messages Counter] Increase Counter';

  public loadCounterSuccess(data: number): Action {
    return {
      type: UnreadMessagesCounterActions.LOAD_COUNTER_SUCCESS,
      payload: {counter: data}
    };
  }

  public increaseCounter(): Action {
    return {
      type: UnreadMessagesCounterActions.INCREASE_COUNTER,
      payload: {}
    };
  }

}
