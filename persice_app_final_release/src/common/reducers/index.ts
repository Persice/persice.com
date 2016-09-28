import { compose } from '@ngrx/core/compose';
import { ActionReducer, combineReducers } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { storeLogger } from 'ngrx-store-logger';
import { routerReducer, RouterState } from '@ngrx/router-store';
import { Observable } from 'rxjs/Observable';
import { ConversationsState, conversationsReducer } from './conversations.reducer';
import { MessagesState, messagesReducer } from './messages.reducer';
import { UnreadMessagesCounterState, unreadMessagesCounterReducer } from './unread-messages-counter.reducer';
import { NewConnectionsCounterState, newConnectionsCounterReducer } from './new-connections-counter.reducer';
import { SelectedPersonState, selecterPersonReducer } from './selected-person.reducer';

export interface AppState {
  router: RouterState;
  conversations: ConversationsState;
  messages: MessagesState;
  unreadMessagesCounter: UnreadMessagesCounterState;
  newConnectionsCounter: NewConnectionsCounterState;
  selectedPerson: SelectedPersonState;
}

export const reducers = {
  router: routerReducer,
  conversations: conversationsReducer,
  messages: messagesReducer,
  unreadMessagesCounter: unreadMessagesCounterReducer,
  newConnectionsCounter: newConnectionsCounterReducer,
  selectedPerson: selecterPersonReducer
};

// Generate a reducer to set the root state in dev mode for HMR
function stateSetter(reducer: ActionReducer<any>): ActionReducer<any> {
  return function (state, action) {
    if (action.type === 'SET_ROOT_STATE') {
      return action.payload;
    }
    return reducer(state, action);
  };
}

const DEV_REDUCERS = [ stateSetter, storeFreeze ];
if ([ 'logger', 'both' ].includes(STORE_DEV_TOOLS)) { // set in constants.js file of project root
  DEV_REDUCERS.push(storeLogger());
}

const developmentReducer: any = compose(...DEV_REDUCERS, combineReducers)(reducers);
const productionReducer: any = combineReducers(reducers);

export function rootReducer(state: any, action: any) {
  if (ENV !== 'development') {
    return productionReducer(state, action);
  } else {
    return developmentReducer(state, action);
  }
}

export function getConversationsState() {
  return (state$: Observable<AppState>) => state$
    .select(s => s.conversations);
}

export function getMessagesState() {
  return (state$: Observable<AppState>) => state$
    .select(s => s.messages);
}

export function getUnreadMessagesCounterState() {
  return (state$: Observable<AppState>) => state$
    .select(s => s.unreadMessagesCounter);
}

export function getNewConnectionsCounterState() {
  return (state$: Observable<AppState>) => state$
    .select(s => s.newConnectionsCounter);
}

export function getSelectedPersonState() {
  return (state$: Observable<AppState>) => state$
    .select(s => s.selectedPerson);
}
