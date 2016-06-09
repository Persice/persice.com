import {Component} from '@angular/core';
import {RouteConfig, RouterOutlet} from '@angular/router-deprecated';
import {ConversationsMobileComponent} from './conversations';
import {ConversationMobileComponent} from './conversation';
import {NewConversationMobileComponent} from './new-conversation';

@Component({
  selector: 'prs-mobile-messages',
  template: `<router-outlet></router-outlet>`,
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
  }
])
export class MessagesMobileComponent { }
