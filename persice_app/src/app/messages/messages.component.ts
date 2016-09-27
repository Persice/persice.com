import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { ConversationsComponent } from './conversations';
import { ConversationsService } from '../../common/messages/conversations.service';
import { WebsocketService } from '../shared/services/websocket.service';

@Component({
  selector: 'prs-messages',
  template: <any>require('./messages.html'),
  directives: [
    ConversationsComponent,
    ROUTER_DIRECTIVES
  ],
  providers: [ ConversationsService, WebsocketService ]
})
export class MessagesComponent implements OnInit {
  constructor(private _router: Router) { }

  ngOnInit() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  public navigateToConversation(id) {
    this._router.navigateByUrl('/messages/' + id);
  }
}
