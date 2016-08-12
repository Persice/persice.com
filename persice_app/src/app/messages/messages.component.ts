import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { InboxService } from '../shared/services';
import { ConversationsComponent, ConversationsHeaderComponent } from './conversations';

@Component({
  selector: 'prs-messages',
  template: <any>require('./messages.html'),
  directives: [
    ConversationsComponent,
    ConversationsHeaderComponent,
    ROUTER_DIRECTIVES
  ],
  providers: [
    InboxService
  ]
})
export class MessagesComponent implements OnInit {
  public counter: number = 0;

  constructor(private _router: Router) { }

  ngOnInit() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  public navigateToConversation(id) {
    this._router.navigateByUrl('/messages/' + id);
  }

}
