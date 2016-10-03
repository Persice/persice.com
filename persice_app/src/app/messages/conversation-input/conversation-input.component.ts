import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'prs-send-message',
  template: <any>require('./conversation-input.html')
})
export class ConversationInputComponent {
  @Output() newMessage: EventEmitter<any> = new EventEmitter();
  @Input() disabled;
  private message: string = '';

  private sendMessage(event): any {
    if (this.message.length > 0 && !this.disabled) {
      this.newMessage.emit(this.message);
      this.message = '';
    }
  }

}
