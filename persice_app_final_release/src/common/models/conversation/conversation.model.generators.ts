import { Conversation } from './conversation.model';

export class ConversationGenerators {

  public static givenAnyConversation(): Conversation {
    return new Conversation(this.givenAnyConversationDto());
  }

  public static givenAnyConversationDto() {
    return {
      "facebook_id": "560101450791647",
      "first_name": "Saša",
      "friend_id": "57",
      "id": "57",
      "image": "https://d2v6m3k9ul63ej.cloudfront.net/images/facebook_profiles/2016/05/25/fb_image_560101450791647_1464153126.jpg",
      "last_message_body": "Hello world!",
      "last_name": "Macakanja",
      "read_at": "2016-06-02 14:42:26.515381+00:00",
      "recipient_id": "/api/v1/auth/user/99/",
      "resource_uri": "/api/v1/inbox/last/57/",
      "sender_id": "/api/v1/auth/user/57/",
      "sent_at": "2016-04-25T10:42:03.468780+00:00",
      "unread_counter": 0
    };
  }
}
