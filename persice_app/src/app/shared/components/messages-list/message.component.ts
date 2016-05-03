import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {Router} from '@angular/router-deprecated';
import {CheckImageDirective} from '../../directives';

@Component({
  selector: 'prs-message',
  directives: [CheckImageDirective],
  template: `
  <div class="message is-open">
    <div class="flag flag--top flag--small">
      <div class="flag__img" (click)="openProfile(message.username)">
        <div class="avatar avatar--medium">
          <div class="avatar-holder"
           checkimage="{{message.image}}" [suffix]="'.56x56_q100_crop.jpg'">
          </div>
        </div>
      </div>
      <div class="flag__body">
        <div class="message__name">
          <span (click)="openProfile(message.username)">{{message?.name}}</span>
          <span (click)="openProfile(message.username)" class="message__timestamp">{{message?.time}}</span>
        </div>
        <div class="message__text">{{message?.body}}</div>
      </div>
    </div>
  </div>
  `,
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageComponent {
  @Input() message;

  constructor(private _router: Router) {

  }

  openProfile(username) {
    this._router.parent.parent.navigate(['./ProfileView', { username: username }]);
  }
}
