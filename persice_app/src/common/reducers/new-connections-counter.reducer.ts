import { Action } from '@ngrx/store';
import { NewConnectionsCounterActions } from '../actions';

export interface NewConnectionsCounterState {
  counter: number;
}
;

let initialState: NewConnectionsCounterState = {
  counter: 0
};

export default function (state = initialState, action: Action): NewConnectionsCounterState {
  switch (action.type) {
    case NewConnectionsCounterActions.LOAD_COUNTER_SUCCESS: {
      const counter = action.payload.counter;
      return Object.assign({}, state, {counter: counter});
    }
    case NewConnectionsCounterActions.INCREASE_COUNTER: {
      return Object.assign({}, state, {counter: state.counter + 1});
    }
    default: {
      return state;
    }
  }
}
