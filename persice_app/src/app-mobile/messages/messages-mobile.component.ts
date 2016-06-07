import {Component} from '@angular/core';
import {RouteConfig, RouterOutlet} from '@angular/router-deprecated';
import {ConversationsMobileComponent} from './conversations';
import {ConversationMobileComponent} from './conversation';
import {NewConversationMobileComponent} from "./new-conversation/new-conversation-mobile.component";

@Component({
  selector: 'prs-mobile-messages',
  template: require('./messages-mobile.html'),
  directives: [RouterOutlet]
})
@RouteConfig([
  {
    path: '/',
    component: ConversationsMobileComponent,
    name: 'Conversations',
    useAsDefault: true
  },
  {
    path: '/:senderId',
    component: ConversationMobileComponent,
    name: 'Conversation'
  },
  {
    path: '/new',
    component: NewConversationMobileComponent,
    name: 'NewConversation'
  },
  {
    path: '/new/:recipientId',
    component: NewConversationMobileComponent,
    name: 'NewConversationToRecipient'
  }
])
export class MessagesMobileComponent {

}
