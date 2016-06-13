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

      let existingConversationsIDs: number[] = state.entities.map((conversation: Conversation, index) => {
        return conversation.id;
      });

      let conversationsNew: Conversation[] = conversations.map((conversation: Conversation, index) => {
        if (existingConversationsIDs.indexOf(conversation.id) === -1 ) {
          return conversation;
        }
      });

      return Object.assign({}, state, {
        entities: [...state.entities, ...conversationsNew],
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

    case ConversationActions.ADD_NEW_OR_REPLACE_EXISTING: {
      const newConversation: Conversation = action.payload;
      let conversationExists: boolean = false;

      let conversations = state.entities
        .map((conversation: Conversation, index: number) => {
          if (conversation.id === newConversation.id) {
            conversationExists = true;

            conversation.unread = newConversation.unread;
            conversation.unreadCounter = newConversation.unreadCounter;
            conversation.body = newConversation.body;
            conversation.sentAt = newConversation.sentAt;
            return conversation;
          }
          return conversation;
        });

      if (!conversationExists) {
        return Object.assign({}, state, {
          entities: [newConversation, ...state.entities]
        });
      } else {
        return Object.assign({}, state, {
          entities: [...conversations]
        });
      }

    }

    default: {
      return state;
    }
  }
}
