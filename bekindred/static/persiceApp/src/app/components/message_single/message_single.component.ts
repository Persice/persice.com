import {Component, Input, ChangeDetectionStrategy} from 'angular2/core';
import {Router} from 'angular2/router';

@Component({
  selector: 'message',
  template: `
	<div class="message is-open">
	  <div class="flag flag--top flag--small">
	    <div class="flag__img" (click)="openProfile(message.username)">
	      <div class="avatar avatar--medium">
          <div class="avatar-holder"
          [ngStyle]="{'background-image': 'url(' + message.image + ')'}">
          </div>
        </div>
	    </div>
	    <div class="flag__body">
	      <div class="message__name" (click)="openProfile(message.username)">
          {{message?.name}}
          <span class="message__timestamp">{{message?.time}}</span>
        </div>
	      <div class="message__text">{{message?.body}}</div>
	    </div>
	  </div>
	</div>
	`,
	 changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageSingleComponent {
  @Input() message;

  constructor(private _router: Router) {

  }

  openProfile(username) {
		this._router.parent.parent.navigate(['./ProfileView', { username: username }]);
  }
}
