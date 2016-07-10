import {Component, ChangeDetectionStrategy, Input, Output, EventEmitter} from '@angular/core';
import {LoadingIndicatorComponent} from '../../../../common/loading-indicator';

@Component({
  selector: 'prs-mobile-conversation-input',
  template: <any>require('./conversation-input-mobile.html'),
  directives: [LoadingIndicatorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConversationInputMobileComponent {
  @Input() isNewMessageBeingSent: boolean;
  @Output() onSendMessage: EventEmitter<any> = new EventEmitter();

  public message: string = '';

  public sendMessage() {
    if (this.message.length > 0 && !this.isNewMessageBeingSent) {
      this.onSendMessage.emit(this.message);
      this.message = '';
    }
  }
}
