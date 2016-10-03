import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'prs-messages',
  templateUrl: './messages.html'
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
