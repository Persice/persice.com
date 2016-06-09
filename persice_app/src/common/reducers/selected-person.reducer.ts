import {Action} from '@ngrx/store';
import {SelectedPersonActions} from '../actions';

const CROWD_TYPE = 'crowd';
const CONNECTION_TYPE = 'connection';

export interface SelectedPersonState {
  person: any;
  selected: boolean;
  type: string;
  useAsNewConversationRecipient: boolean;
  connected: boolean;
  accept: boolean;
  pass: boolean;
};

let initialState: SelectedPersonState = {
  person: {},
  selected: false,
  type: '',
  useAsNewConversationRecipient: false,
  connected: false,
  accept: false,
  pass: false
};

export default function(state = initialState, action: Action): SelectedPersonState {
  switch (action.type) {
    case SelectedPersonActions.SET: {
      const selectedPerson: any = action.payload.person;
      const profileType: any = action.payload.type;

      let connectedStatus: boolean;
      if (profileType === CONNECTION_TYPE) {
        connectedStatus = true;
      } else if (profileType === CROWD_TYPE) {
        connectedStatus = false;
      }

      return Object.assign({}, state, {
        person: selectedPerson,
        type: profileType,
        connected: connectedStatus,
        selected: true,
        useAsNewConversationRecipient: false,
        accept: false,
        pass: false
      });
    }
    case SelectedPersonActions.CLEAR: {
      return Object.assign({}, state, initialState);
    }
    case SelectedPersonActions.USE_AS_NEW_CONVERSATION_RECIPIENT: {
      return Object.assign({}, state, { useAsNewConversationRecipient: true});
    }
    case SelectedPersonActions.ACCEPTED: {
      return Object.assign({}, state, { accept: true });
    }
    case SelectedPersonActions.PASSED: {
      return Object.assign({}, state, { pass: true });
    }
    default: {
      return state;
    }
  }
}
