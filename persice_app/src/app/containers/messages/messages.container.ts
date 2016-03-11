import {Component} from 'angular2/core';
import {RouteConfig, RouterLink, ROUTER_DIRECTIVES, Router, Location}
from 'angular2/router';

/**
 * Services
 */
import {InboxService} from '../../services/inbox.service';


/**
 * Components
 */
import {MessagesSidebarComponent} from '../../components/messages/messages_sidebar.component';
import {MessagesChatComponent} from '../../components/messages/messages_chat.component';
import {MessagesNewComponent} from '../../components/messages/messages_new.component';
import {MessagesSidebarHeaderComponent} from '../../components/messages/messages_sidebar_header.component';

let view = require('./messages.html');
@Component({
  selector: 'message',
  template: view,
  directives: [
    MessagesSidebarComponent,
    MessagesSidebarHeaderComponent,
    ROUTER_DIRECTIVES
  ],
  providers: [
    InboxService
  ]
})
@RouteConfig([
  {
    path: '/:threadId',
    component: MessagesChatComponent,
    name: 'SingleConversation'
  },
  {
    path: '/new/',
    component: MessagesNewComponent,
    name: 'ConversationNew',
    useAsDefault: true
  },
  {
    path: '/new/:friendId',
    component: MessagesNewComponent,
    name: 'ConversationNewSelected',
  }
])
export class MessagesContainer {
  counter: number = 0;
  constructor(
    private inboxService: InboxService,
    private _router: Router
    ) {

  }

  ngOnInit() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  navigateToConversation(id) {
    this._router.navigate(['SingleConversation', { threadId: id }]);
  }

}
