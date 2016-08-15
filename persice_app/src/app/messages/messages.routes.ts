import { RouterConfig } from '@angular/router';
import { MessagesComponent } from './messages.component';
import { ConversationComponent } from './conversation';
import { NewConversationComponent } from './new-conversation';

export const routesMessages: RouterConfig = [
  {
    path: 'messages',
    component: MessagesComponent,
    children: [
      {
        path: '',
        redirectTo: '/messages/new',
        terminal: true
      },
      {
        path: 'new',
        component: NewConversationComponent
      },
      {
        path: 'new/:friendId',
        component: NewConversationComponent
      },
      {
        path: ':threadId',
        component: ConversationComponent
      },

    ]
  }
];
