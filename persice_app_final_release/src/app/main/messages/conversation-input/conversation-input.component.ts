import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'prs-send-message',
  templateUrl: './conversation-input.html'
})
export class ConversationInputComponent {
  @Output() newMessage: EventEmitter<any> = new EventEmitter();
  @Input() disabled;
  message: string = '';

  sendMessage(event) {
    if (this.message.length > 0 && !this.disabled) {
      this.newMessage.emit(this.message);
      this.message = '';
    }

  }

}
