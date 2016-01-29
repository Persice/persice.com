import {Component, Input, ChangeDetectionStrategy} from 'angular2/core';

import {MessageSingleComponent} from '../message_single/message_single.component';
@Component({
  selector: 'message-list',
  template: `
  <template ngFor #item [ngForOf]="messages">
    <div class="chat__time">
      <hr class="hr">
      <span class="chat__time__value">{{item.displayDate}}</span>
    </div>
    <message *ngFor="#m of item.data" [message]="m"></message>
  </template>
	`,
  directives: [
    MessageSingleComponent
  ]
})
export class MessageListComponent {
  @Input() messages;
}
