import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'prs-message',
  template: `
  <div class="message is-open">
    <div class="flag flag--top flag--small">
      <div class="flag__img" (click)="openProfile(message.senderUsername)">
        <div class="avatar avatar--medium">
          <div class="avatar-holder"
            checkimage="{{message.image}}" [suffix]="'.56x56_q100_crop.jpg'">
          </div>
        </div>
      </div>
      <div class="flag__body">
        <div class="message__name">
          <span (click)="openProfile(message.senderUsername)">{{message.senderName}}</span>
          <span (click)="openProfile(message.senderUsername)" class="message__timestamp">{{message.time}}</span>
        </div>
        <div [innerHTML]="message.body | markup:true" class="message__text"></div>
      </div>
    </div>
  </div>
  `
})
export class MessageComponent {
  @Input() message;

  constructor(private _router: Router) {

  }

  openProfile(username) {
    this._router.navigateByUrl('/' + username);
  }
}