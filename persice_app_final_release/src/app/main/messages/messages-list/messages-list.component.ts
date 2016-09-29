import { Component, Input } from '@angular/core';
import { Message } from '../../../../common/models/message/message.model';
import { ListUtil } from '../../../../common/core/util';

@Component({
  selector: 'prs-message-list',
  template: `
  <div *ngFor="let group of groups">
    <div class="chat__time">
      <hr class="hr">
      <span class="chat__time__value">{{group.date}}</span>
    </div>
    <prs-message *ngFor="let m of group.data" [message]="m.message"></prs-message>
  </div>
  `,
})
export class MessagesListComponent {
  groups: any[] = [];

  @Input() set messages(messages: Message[]) {
    this.groups = [];
    for (var i = 0; i < messages.length; i++) {
      let dateRaw = messages[i].dateRaw;

      let idx = ListUtil.findIndex(this.groups, {date: dateRaw});

      if (idx === -1) {
        this.groups = [...this.groups, {
          date: dateRaw,
          data: []
        }];
        idx = this.groups.length - 1;
      }

      this.groups[idx].data = [...this.groups[idx].data, {
        message: messages[i]
      }];

      this.groups[idx].data = ListUtil.orderBy(this.groups[idx].data, ['date'], ['desc']);
    }
  };
}
