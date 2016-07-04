import {RouterConfig} from '@angular/router';

import {ConversationsMobileComponent} from './conversations';
import {ConversationMobileComponent} from './conversation';
import {NewConversationMobileComponent} from './new-conversation';
import {MessagesMobileComponent} from './messages-mobile.component';
export const routesMessagesMobile: RouterConfig = [
  {
    path: 'messages',
    component: MessagesMobileComponent,
    children: [
      {
        path: '',
        component: ConversationsMobileComponent,
        terminal: true
      },
      {
        path: 'new',
        component: NewConversationMobileComponent,
      },
      {
        path: ':senderId',
        component: ConversationMobileComponent,
      }
    ]
  }
];
