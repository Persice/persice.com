import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Message } from '../models';

export interface MessagesData {
  messages: Message[];
  count: number;
}

@Injectable()
export class MessageActions {

  public static LOAD_COLLECTION_SUCCESS = '[Message] Load Collection Success';
  public static LOADING_COLLECTION = '[Message] Loading Collection';
  public static RESET_COLLECTION = '[Message] Reseting Collection';
  public static LOADED_CONVERSATION_TITLE = '[Message] Loaded Conversation title';
  public static COLLECTION_FULLY_LOADED = '[Message] Collection Fully Loaded';
  public static MORE_ITEMS_LOADED = '[Message] More Items Loaded';
  public static SENDING_NEW_MESSAGE = '[Message] Sending New Message';
  public static ADD_NEW_MESSAGE_TO_COLLECTION_SUCCESS = '[Message] Add New Message To Collection Success';
  public static ADD_NEW_MESSAGE_TO_COLLECTION_VIA_WEBSOCKET_SUCCESS = '[Message] Add New Message To Collection Via Websocket Success';

  public loadCollectionSuccess(data: MessagesData): Action {
    return {
      type: MessageActions.LOAD_COLLECTION_SUCCESS,
      payload: {messages: data.messages, count: data.count}
    };
  }

  public loadingCollection(loading: boolean): Action {
    return {
      type: MessageActions.LOADING_COLLECTION,
      payload: loading
    };
  }

  public resetCollection(): Action {
    return {
      type: MessageActions.RESET_COLLECTION,
      payload: {}
    };
  }

  public loadedConversationTitle(title: string): Action {
    return {
      type: MessageActions.LOADED_CONVERSATION_TITLE,
      payload: title
    };
  }

  public collectionFullyLoaded(): Action {
    return {
      type: MessageActions.COLLECTION_FULLY_LOADED,
      payload: {}
    };
  }

  public moreItemsLoaded(count: number): Action {
    return {
      type: MessageActions.MORE_ITEMS_LOADED,
      payload: count
    };
  }

  public sendingNewMessage(): Action {
    return {
      type: MessageActions.SENDING_NEW_MESSAGE,
      payload: {}
    };
  }

  public addNewMessageToCollectionSuccess(message: Message): Action {
    return {
      type: MessageActions.ADD_NEW_MESSAGE_TO_COLLECTION_SUCCESS,
      payload: message
    };
  }

  public addNewMessageToCollectionViaWebsocketSuccess(message: Message): Action {
    return {
      type: MessageActions.ADD_NEW_MESSAGE_TO_COLLECTION_VIA_WEBSOCKET_SUCCESS,
      payload: message
    };
  }

}
