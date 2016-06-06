import conversationsReducer from './conversations.reducer';
import {ConversationsState} from './conversations.reducer';
import {ConversationActions} from '../actions';
import {Conversation} from '../models';

import {
  it,
  describe,
  expect
} from '@angular/core/testing';
import {ConversationGenerators} from '../models/conversation/conversation.model.generators';

describe('Conversations reducer', () => {
  let emptyState: ConversationsState = {
    entities: [],
    selectedItem: <Conversation>{},
    count: 0,
    loading: false,
    loaded: false
  };

  let stateWithMessages: ConversationsState = {
    entities: [ConversationGenerators.givenAnyConversation()],
    selectedItem: <Conversation>{},
    count: 1,
    loading: false,
    loaded: false
  };

  let payloadWithConversations: any = {
    conversations: [ConversationGenerators.givenAnyConversation()],
    count: 1
  };

  it('RESET COLLECTION', () => {
    // given
    let payload = emptyState;

    // when
    let newState = conversationsReducer(emptyState, { type: ConversationActions.RESET_COLLECTION, payload: payload });

    // then
    expect(newState).toEqual(emptyState);
  });

  it('LOAD COLLECTION SUCCESS', () => {
    // given
    let payload = payloadWithConversations;

    // when
    let newState = conversationsReducer(
      emptyState,
      { type: ConversationActions.LOAD_COLLECTION_SUCCESS, payload: payload });

    // then
    expect(newState).toEqual(stateWithMessages);
  });

  it('LOADING COLLECTION', () => {
    // given
    let payload = stateWithMessages;

    // when
    let newState = conversationsReducer(emptyState, { type: ConversationActions.LOADING_COLLECTION, payload: payload });

    // then
    let expectedState = emptyState;
    expectedState.loading = true;

    expect(newState).toEqual(expectedState);
  });
});
