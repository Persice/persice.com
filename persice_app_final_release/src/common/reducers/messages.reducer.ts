import { Action } from '@ngrx/store';
import { Message } from '../models';
import { MessageActions } from '../actions';

export interface MessagesState {
  entities: Message[];
  totalCount: number;
  loadedCount: number;
  conversationTitle: string;
  loading: boolean;
  loaded: boolean;
  isNewMessageBeingSent: boolean;
}
;

let initialState: MessagesState = {
  entities: [],
  totalCount: 0,
  loadedCount: 0,
  conversationTitle: '',
  loading: false,
  loaded: false,
  isNewMessageBeingSent: false
};

export function messagesReducer(state = initialState, action: Action): MessagesState {
  switch (action.type) {

    case MessageActions.RESET_COLLECTION: {
      return Object.assign({}, state, initialState);
    }

    case MessageActions.LOAD_COLLECTION_SUCCESS: {
      const messages: Message[] = action.payload.messages;
      const count: number = action.payload.count;

      return Object.assign({}, state, {
        entities: [ ...messages, ...state.entities ],
        totalCount: count,
        loading: false
      });
    }

    case MessageActions.ADD_NEW_MESSAGE_TO_COLLECTION_SUCCESS: {
      const message: Message = action.payload;

      return Object.assign({}, state, {
        entities: [ ...state.entities, message ],
        totalCount: state.totalCount + 1,
        isNewMessageBeingSent: false
      });
    }

    case MessageActions.ADD_NEW_MESSAGE_TO_COLLECTION_VIA_WEBSOCKET_SUCCESS: {
      const message: Message = action.payload;

      return Object.assign({}, state, {
        entities: [ ...state.entities, message ],
        totalCount: state.totalCount + 1
      });
    }

    case MessageActions.LOADING_COLLECTION:
      return Object.assign({}, state, {
        loading: true
      });

    case MessageActions.MORE_ITEMS_LOADED:
      return Object.assign({}, state, {
        loadedCount: action.payload + state.loadedCount
      });

    case MessageActions.COLLECTION_FULLY_LOADED:
      return Object.assign({}, state, {
        loaded: true
      });

    case MessageActions.SENDING_NEW_MESSAGE:
      return Object.assign({}, state, {
        isNewMessageBeingSent: true
      });

    case MessageActions.LOADED_CONVERSATION_TITLE: {
      const title: string = action.payload;

      return Object.assign({}, state, {
        conversationTitle: title
      });
    }

    default: {
      return state;
    }
  }
}
