import {Component, Input, ChangeDetectionStrategy} from 'angular2/core';


@Component({
  selector: 'message',
  template: `
	<div class="message is-open">
	  <div class="flag flag--top flag--small">
	    <div class="flag__img">
	      <div class="avatar avatar--medium">
          <div class="avatar-holder"
          [ngStyle]="{'background-image': 'url(' + message.image + ')'}">
          </div>
        </div>
	    </div>
	    <div class="flag__body">
	      <div class="message__name">{{message?.name}}</div>
	      <div class="message__text">{{message?.body}}</div>
	      <div class="message__time">{{message?.time}}</div>
	    </div>
	  </div>
	</div>
	`,
	 changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageSingleComponent {
  @Input() message;
}
