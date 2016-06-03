import {Action} from '@ngrx/store';

import {Conversation} from '../models';
import {ConversationActions} from '../actions';

export interface ConversationsState {
  entities: Conversation[];
  selectedItem: Conversation;
  count: number;
  loading: boolean;
  loaded: boolean;
};

let initialState: ConversationsState = {
  entities: [],
  selectedItem: <Conversation>{},
  count: 0,
  loading: false,
  loaded: false
};

export default function(state = initialState, action: Action): ConversationsState {
  switch (action.type) {

    case ConversationActions.RESET_COLLECTION: {
      return Object.assign({}, state, initialState);
    }

    case ConversationActions.SELECT_CONVERSATION: {
      const conversation: Conversation = action.payload;
      return Object.assign({}, state, { selectedItem: conversation });
    }

    case ConversationActions.LOAD_COLLECTION_SUCCESS: {
      const conversations: Conversation[] = action.payload.conversations;
      const count: number = action.payload.count;

      return Object.assign({}, state, {
        entities: [...state.entities, ...conversations],
        count: count,
        loading: false
      });
    }

    case ConversationActions.LOADING_COLLECTION:
      return Object.assign({}, state, {
        loading: true
      });

    case ConversationActions.COLLECTION_FULLY_LOADED:
      return Object.assign({}, state, {
        loaded: true
      });

    default: {
      return state;
    }
  }
}
