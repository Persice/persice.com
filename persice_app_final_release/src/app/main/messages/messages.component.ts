import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InboxService } from '../../../common/services/inbox.service';

@Component({
  selector: 'prs-messages',
  templateUrl: './messages.html',
  providers: [
    InboxService
  ]
})
export class MessagesComponent implements OnInit {
  public counter: number = 0;

  constructor(private _router: Router) {
  }

  ngOnInit() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  public navigateToConversation(id) {
    this._router.navigateByUrl('/messages/' + id);
  }

}
