import {Action} from '@ngrx/store';

import {Conversation} from '../models';
import {ConversationActions} from '../actions';
// import {ListUtil} from '../../app/shared/core';

export interface ConversationsState {
  items: Conversation[];
  count: number;
  loading: boolean;
};

let initialState: ConversationsState = {
  items: [],
  count: 0,
  loading: false
};

export default function(state = initialState, action: Action): ConversationsState {
  switch (action.type) {

    case ConversationActions.LOAD_COLLECTION_SUCCESS: {
      const objects: Conversation[] = action.payload.conversations;
      const count: number = action.payload.count;

      return Object.assign({}, state, {
        items: [...objects],
        count: count,
        loading: false
      });
    }

    case ConversationActions.LOADING_COLLECTION:
      return Object.assign({}, state, {
        loading: true
      });

    default: {
      return state;
    }
  }
}
