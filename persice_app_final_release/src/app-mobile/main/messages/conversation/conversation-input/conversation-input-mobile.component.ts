import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'prs-mobile-conversation-input',
  templateUrl: './conversation-input-mobile.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConversationInputMobileComponent {
  @Input() isNewMessageBeingSent: boolean;
  @Output() onSendMessage: EventEmitter<any> = new EventEmitter();

  public message: string = '';

  public sendMessage(event: MouseEvent) {
    if (this.message.length > 0 && !this.isNewMessageBeingSent) {
      this.onSendMessage.emit(this.message);
      this.message = '';
    }
  }
}
