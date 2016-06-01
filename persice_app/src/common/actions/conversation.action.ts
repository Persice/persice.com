import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';
import {Conversation} from '../models';

interface ConversationsData {
  conversations: Conversation[];
  count: number;
}

/**
 * Instead of passing around action string constants and manually recreating
 * action objects at the point of dispatch, we create services encapsulating
 * each appropriate action group. Action types are included as static
 * members and kept next to their action creator. This promotes a
 * uniform interface and single import for appropriate actions
 * within application components.
 */
@Injectable()
export class ConversationActions {

  public static LOAD_COLLECTION_SUCCESS = '[Conversation] Load Collection Success';
  public static LOADING_COLLECTION = '[Conversation] Loading Collection';
  public static RESET_COLLECTION = '[Conversation] Reseting Collection';

  public loadCollectionSuccess(data: ConversationsData): Action {
    return {
      type: ConversationActions.LOAD_COLLECTION_SUCCESS,
      payload: {conversations: data.conversations, count: data.count}
    };
  }

  public loadingCollection(loading: boolean): Action {
    return {
      type: ConversationActions.LOADING_COLLECTION,
      payload: loading
    };
  }

  public resetCollection(): Action {
    return {
      type: ConversationActions.RESET_COLLECTION,
      payload: {}
    };
  }

}
