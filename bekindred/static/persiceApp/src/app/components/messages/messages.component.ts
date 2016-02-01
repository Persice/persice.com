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
import {MessagesEmptyComponent} from './messages_empty.component';

let view = require('./messages.html');
@Component({
  selector: 'message',
  template: view,
  directives: [
    MessagesSidebarComponent,
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
		path: '/',
		component: MessagesEmptyComponent,
		name: 'ConversationEmpty',
		useAsDefault: true
	},


])
export class MessagesComponent {

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
