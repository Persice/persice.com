import unreadMessagesCounterReducer from './new-connections-counter.reducer';
import {NewConnectionsCounterState} from './new-connections-counter.reducer';
import {NewConnectionsCounterActions} from '../actions';

import {
  it,
  describe,
  expect
} from '@angular/core/testing';

describe('New connections counter reducer', () => {
  let emptyState: NewConnectionsCounterState = {
    counter: 0
  };

  let stateWithCounter: NewConnectionsCounterState = {
    counter: 5
  };

  let stateWithIncreasedCounter: NewConnectionsCounterState = {
    counter: 6
  };

  it('LOAD COUNTER SUCCESS', () => {
    // given
    let payload = {counter: 5};

    // when
    let newState = unreadMessagesCounterReducer(
      emptyState,
      { type: NewConnectionsCounterActions.LOAD_COUNTER_SUCCESS, payload: payload });

    // then
    expect(newState).toEqual(stateWithCounter);
  });

  it('INCREASE COUNTER', () => {
    // given
    let payload = {};

    // when
    let newState = unreadMessagesCounterReducer(
      stateWithCounter,
      { type: NewConnectionsCounterActions.INCREASE_COUNTER, payload: payload });

    // then
    expect(JSON.stringify(newState)).toBe(JSON.stringify(stateWithIncreasedCounter));
  });


});
