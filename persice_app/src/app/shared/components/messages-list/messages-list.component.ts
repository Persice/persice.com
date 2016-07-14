import { Component, Input } from '@angular/core';
import { MessageComponent } from './message.component';

@Component({
  selector: 'prs-message-list',
  template: `
  <template ngFor let-item [ngForOf]="messages">
    <div class="chat__time">
      <hr class="hr">
      <span class="chat__time__value">{{item.displayDate}}</span>
    </div>
    <prs-message *ngFor="let m of item.data" [message]="m"></prs-message>
  </template>
  `,
  directives: [
    MessageComponent
  ]
})
export class MessagesListComponent {
  @Input() messages;
}
