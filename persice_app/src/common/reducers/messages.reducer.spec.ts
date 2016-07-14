import messagesReducer, { MessagesState } from './messages.reducer';
import { MessageActions } from '../actions';
import { MessageGenerators } from '../models/message/message.model.generators';
import { MessagesData } from '../actions/message.action';

describe('Messages reducer', () => {
  let emptyState: MessagesState = {
    entities: [],
    totalCount: 0,
    loadedCount: 0,
    conversationTitle: '',
    loading: false,
    loaded: false,
    isNewMessageBeingSent: false
  };

  let stateWithMessages: MessagesState = {
    entities: [MessageGenerators.givenAnyMessage()],
    totalCount: 1,
    loadedCount: 0,
    conversationTitle: '',
    loading: false,
    loaded: false,
    isNewMessageBeingSent: false
  };

  let payloadWithMessages: MessagesData = {
    messages: [MessageGenerators.givenAnyMessage()],
    count: 1
  };

  it('RESET COLLECTION', () => {
    // given
    let payload = emptyState;

    // when
    let newState = messagesReducer(emptyState, {type: MessageActions.RESET_COLLECTION, payload: payload});

    // then
    expect(newState).toEqual(emptyState);
  });

  it('LOAD COLLECTION SUCCESS', () => {
    // given
    let payload = payloadWithMessages;

    // when
    let newState = messagesReducer(
      emptyState,
      {type: MessageActions.LOAD_COLLECTION_SUCCESS, payload: payload});

    // then
    expect(newState).toEqual(stateWithMessages);
  });

  it('ADD NEW MESSAGE TO COLLECTION SUCCESS', () => {
    // given
    let payload = MessageGenerators.givenAnyMessage();

    // when
    let newState = messagesReducer(
      emptyState,
      {type: MessageActions.ADD_NEW_MESSAGE_TO_COLLECTION_SUCCESS, payload: payload});

    // then
    expect(JSON.stringify(newState)).toBe(JSON.stringify(stateWithMessages));
  });

  it('LOADING COLLECTION', () => {
    // given
    let payload = payloadWithMessages;

    // when
    let newState = messagesReducer(emptyState, {type: MessageActions.LOADING_COLLECTION, payload: payload});

    // then
    let expectedState = emptyState;
    expectedState.loading = true;

    expect(newState).toEqual(expectedState);
  });

  it('MORE ITEMS LOADED', () => {
    // given
    let payload = payloadWithMessages;

    // when
    let newState = messagesReducer(stateWithMessages, {type: MessageActions.LOADING_COLLECTION, payload: payload});

    // then
    expect(newState.loadedCount).toEqual(stateWithMessages.loadedCount);
  });

  it('COLLECTION FULLY LOADED', () => {
    // given
    let payload = payloadWithMessages;

    // when
    let newState = messagesReducer(stateWithMessages,
      {type: MessageActions.COLLECTION_FULLY_LOADED, payload: payload});

    // then
    expect(newState.loaded).toEqual(true);
  });

  it('SENDING NEW MESSAGE', () => {
    // given
    let payload = payloadWithMessages;

    // when
    let newState = messagesReducer(stateWithMessages,
      {type: MessageActions.SENDING_NEW_MESSAGE, payload: payload});

    // then
    expect(newState.isNewMessageBeingSent).toEqual(true);
  });

  it('LOADED CONVERSATION TITLE', () => {
    // when
    let newState = messagesReducer(stateWithMessages,
      {type: MessageActions.LOADED_CONVERSATION_TITLE, payload: 'Hello'});

    // then
    expect(newState.conversationTitle).toEqual('Hello');
  });
});
