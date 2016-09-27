import { Action } from '@ngrx/store';
import { UnreadMessagesCounterActions } from '../actions';

export interface UnreadMessagesCounterState {
  counter: number;
}
;

let initialState: UnreadMessagesCounterState = {
  counter: 0
};

export function unreadMessagesCounterReducer(state = initialState, action: Action): UnreadMessagesCounterState {
  switch (action.type) {
    case UnreadMessagesCounterActions.LOAD_COUNTER_SUCCESS: {
      const counter = action.payload.counter;
      return Object.assign({}, state, { counter: counter });
    }
    case UnreadMessagesCounterActions.INCREASE_COUNTER: {
      return Object.assign({}, state, { counter: state.counter + 1 });
    }
    default: {
      return state;
    }
  }
}
