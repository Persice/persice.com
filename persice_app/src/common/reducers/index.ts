import '@ngrx/core/add/operator/select';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/let';
import {compose} from '@ngrx/core/compose';
import {storeLogger} from 'ngrx-store-logger';
import {combineReducers} from '@ngrx/store';
import {Observable} from 'rxjs';

/** Every reducer module's default export is the reducer function itself. In
 * addition, each module should export a type or interface that describes
 * the state of the reducer plus any selector functions. The `* as`
 * notation packages up all of the exports into a single object.
 */

import conversationsReducer, * as fromConversations from './conversations.reducer';

/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface AppState {
  conversations: fromConversations.ConversationsState;
}

export default compose(storeLogger(), combineReducers)({
  conversations: conversationsReducer
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
