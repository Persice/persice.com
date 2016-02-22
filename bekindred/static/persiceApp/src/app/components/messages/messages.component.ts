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
import {MessagesSidebarComponent} from './messages_sidebar.component';
import {MessagesChatComponent} from './messages_chat.component';
import {MessagesNewComponent} from './messages_new.component';
import {MessagesSidebarHeaderComponent} from './messages_sidebar_header.component';

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
export class MessagesComponent {
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
