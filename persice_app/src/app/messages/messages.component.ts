import {Component, OnInit} from 'angular2/core';
import {RouteConfig, RouterLink, ROUTER_DIRECTIVES, Router, Location}
from 'angular2/router';


import {InboxService} from '../shared/services';

import {
  ConversationsComponent,
  ConversationsHeaderComponent
} from './conversations';

import {ConversationComponent} from './conversation';
import {NewConversationComponent} from './new-conversation';


@Component({
  selector: 'prs-messages',
  template: require('./messages.html'),
  directives: [
    ConversationsComponent,
    ConversationsHeaderComponent,
    ROUTER_DIRECTIVES
  ],
  providers: [
    InboxService
  ]
})
@RouteConfig([
  {
    path: '/:threadId',
    component: ConversationComponent,
    name: 'SingleConversation'
  },
  {
    path: '/new/',
    component: NewConversationComponent,
    name: 'ConversationNew',
    useAsDefault: true
  },
  {
    path: '/new/:friendId',
    component: NewConversationComponent,
    name: 'ConversationNewSelected',
  }
])
export class MessagesComponent implements OnInit {
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