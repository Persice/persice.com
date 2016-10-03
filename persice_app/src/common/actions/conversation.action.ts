import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Conversation } from '../models';

interface ConversationsData {
  conversations: Conversation[];
  count: number;
}

@Injectable()
export class ConversationActions {

  public static LOAD_COLLECTION_SUCCESS = '[Conversation] Load Collection Success';
  public static LOADING_COLLECTION = '[Conversation] Loading Collection';
  public static RESET_COLLECTION = '[Conversation] Reseting Collection';
  public static SELECT_CONVERSATION = '[Conversation] Select Conversation';
  public static COLLECTION_FULLY_LOADED = '[Conversation] Collection Fully Loaded';
  public static ADD_NEW_OR_REPLACE_EXISTING = '[Conversation] Add New Or Replace Existing';
  public static MARK_SELECTED_CONVERSATION_READ = '[Conversation] Mark Selected Conversation Read';
  public static SELECT_CONVERSATION_BY_ID = '[Conversation] Select Conversation By ID';

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

  public selectConversation(conversation: Conversation): Action {
    return {
      type: ConversationActions.SELECT_CONVERSATION,
      payload: conversation
    };
  }

  public collectionFullyLoaded(): Action {
    return {
      type: ConversationActions.COLLECTION_FULLY_LOADED,
      payload: {}
    };
  }

  public addNewOrReplaceExisting(conversation: Conversation): Action {
    return {
      type: ConversationActions.ADD_NEW_OR_REPLACE_EXISTING,
      payload: conversation
    };
  }

  public markSelectedConversationRead(): Action {
    return {
      type: ConversationActions.MARK_SELECTED_CONVERSATION_READ,
      payload: {}
    }
  }

  public selectConversationByID(id: number): Action {
    return {
      type: ConversationActions.SELECT_CONVERSATION_BY_ID,
      payload: id
    }
  }

}
