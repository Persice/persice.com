import unreadMessagesCounterReducer from './unread-messages-counter.reducer';
import {UnreadMessagesCounterState} from './unread-messages-counter.reducer';
import {UnreadMessagesCounterActions} from '../actions';

import {
  it,
  describe,
  expect
} from '@angular/core/testing';

describe('Unread Messages Counter reducer', () => {
  let emptyState: UnreadMessagesCounterState = {
    counter: 0
  };

  let stateWithCounter: UnreadMessagesCounterState = {
    counter: 5
  };

  let stateWithIncreasedCounter: UnreadMessagesCounterState = {
    counter: 6
  };

  it('LOAD COUNTER SUCCESS', () => {
    // given
    let payload = {counter: 5};

    // when
    let newState = unreadMessagesCounterReducer(
      emptyState,
      { type: UnreadMessagesCounterActions.LOAD_COUNTER_SUCCESS, payload: payload });

    // then
    expect(newState).toEqual(stateWithCounter);
  });

  it('INCREASE COUNTER', () => {
    // given
    let payload = {};

    // when
    let newState = unreadMessagesCounterReducer(
      stateWithCounter,
      { type: UnreadMessagesCounterActions.INCREASE_COUNTER, payload: payload });

    // then
    expect(JSON.stringify(newState)).toBe(JSON.stringify(stateWithIncreasedCounter));
  });


});
