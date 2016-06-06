import {Component} from '@angular/core';
import {RouteConfig, RouterOutlet} from '@angular/router-deprecated';
import {ConversationsMobileComponent} from './conversations';
import {ConversationMobileComponent} from './conversation';

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
  }
])
export class MessagesMobileComponent {

}
