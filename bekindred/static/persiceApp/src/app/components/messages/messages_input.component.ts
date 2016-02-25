import {Component, Input, Output, EventEmitter} from 'angular2/core';


@Component({
  selector: '.chat__send-message',
  template: `
  <div class="tableize">
    <div class="tableize__cell tableize__cell--fill">
      <div class="tableize__content">
        <textarea [(ngModel)]="message" class="c-input c-input--large" placeholder="Write a message"></textarea>
      </div>
    </div>
    <div class="tableize__cell">
      <div class="tableize__content chat__send-message__has-btn">
        <a (click)="sendMessage($event)" class="btn btn-1 btn-1--full btn-1--filled btn-1--blue ">Send</a>
      </div>
    </div>
  </div>
  `
})
export class MessagesInputComponent {
  @Output() newMessage: EventEmitter<any> = new EventEmitter();
  @Input() disabled;
  message = '';

  sendMessage(event) {
    if (this.message.length > 0 && !this.disabled) {
      this.newMessage.next(this.message);
      this.message = '';
    }

  }

}
