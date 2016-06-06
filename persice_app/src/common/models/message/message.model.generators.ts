import {Message} from "./message.model";
export class MessageGenerators {

  public static givenAnyMessage() {
    return new Message({
      "body": "adasda",
      "recipient": "/api/v1/auth/user/57/",
      "resource_uri": "/api/v1/messages/429/",
      "sender": "/api/v1/auth/user/99/",
      "sender_image": "/media/images/facebook_profiles/2016/04/20/fb_image_10153499968741198_1461156893.jpg",
      "sender_name": "Ljubomir",
      "sender_sender": "ljubomirsimin",
      "sent_at": "2016-04-25T10:59:50.562770"
    });
  }
}
