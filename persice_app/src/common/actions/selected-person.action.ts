import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';

@Injectable()
export class SelectedPersonActions {

  public static SET = '[Selected Person] Set';
  public static CLEAR= '[Selected Person] Clear';
  public static USE_AS_NEW_CONVERSATION_RECIPIENT = '[Selected Person] Use As New Conversation Recipient';
  public static ACCEPTED = '[Selected Person] Accepted';
  public static PASSED = '[Selected Person] Passed';

  public set(person: any, profileType: string): Action {
    return {
      type: SelectedPersonActions.SET,
      payload: { person: person, type: profileType }
    };
  }

  public clear(): Action {
    return {
      type: SelectedPersonActions.CLEAR,
      payload: {}
    };
  }

  public useAsNewConversationRecipient(): Action {
    return {
      type: SelectedPersonActions.USE_AS_NEW_CONVERSATION_RECIPIENT,
      payload: {}
    };
  }

  public accepted(): Action {
    return {
      type: SelectedPersonActions.ACCEPTED,
      payload: {}
    };
  }

  public passed(): Action {
    return {
      type: SelectedPersonActions.PASSED,
      payload: {}
    };
  }

}
