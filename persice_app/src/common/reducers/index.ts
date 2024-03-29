import '@ngrx/core/add/operator/select';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/let';
import { compose } from '@ngrx/core/compose';
import { combineReducers } from '@ngrx/store';
import { Observable } from 'rxjs';
import conversationsReducer from './conversations.reducer';
import * as fromConversations from './conversations.reducer';
import messagesReducer from './messages.reducer';
import * as fromMessages from './messages.reducer';
import unreadMessagesCounterReducer from './unread-messages-counter.reducer';
import * as fromUnreadMessagesCounter from './unread-messages-counter.reducer';
import newConnectionsCounterReducer from './new-connections-counter.reducer';
import * as fromNewConnectionsCounter from './new-connections-counter.reducer';
import selecterPersonReducer from './selected-person.reducer';
import * as fromSelectedPerson from './selected-person.reducer';
// import {storeLogger} from 'ngrx-store-logger';

/** Every reducer module's default export is the reducer function itself. In
 * addition, each module should export a type or interface that describes
 * the state of the reducer plus any selector functions. The `* as`
 * notation packages up all of the exports into a single object.
 */

/**
 * We treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface AppState {
  conversations: fromConversations.ConversationsState;
  messages: fromMessages.MessagesState;
  unreadMessagesCounter: fromUnreadMessagesCounter.UnreadMessagesCounterState;
  newConnectionsCounter: fromNewConnectionsCounter.NewConnectionsCounterState;
  selectedPerson: fromSelectedPerson.SelectedPersonState;
}

// Available: storeLogger()
export default compose(combineReducers)({
  conversations: conversationsReducer,
  messages: messagesReducer,
  unreadMessagesCounter: unreadMessagesCounterReducer,
  newConnectionsCounter: newConnectionsCounterReducer,
  selectedPerson: selecterPersonReducer
});

/**
 * A selector function is a map function factory. We pass it parameters and it
 * returns a function that maps from the larger state tree into a smaller
 * piece of state. This selector simply selects the `conversations` state.
 *
 * Selectors are used with the `let` operator. They take an input observable
 * and return a new observable. Here's how you would use this selector:
 *
 * ```ts
 * class MyComponent {
 *   constructor(state$: Observable<AppState>) {
 *     this.conversationsState$ = state$.let(getConversationsState());
 *   }
 * }
 * ```
 */
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
