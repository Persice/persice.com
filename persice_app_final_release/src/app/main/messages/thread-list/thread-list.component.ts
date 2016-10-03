import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Conversation } from '../../../../common/models/conversation/conversation.model';

@Component({
  selector: 'prs-thread-list',
  template: `
  <prs-thread *ngFor="let item of threads"
              [thread]="item"
              [isActive]="active.id === item.id"
              (selected)="selected.next($event)">
  </prs-thread>
  `,
})
export class ThreadListComponent {
  @Input() threads: Conversation[];
  @Input() active: Conversation;
  @Output() selected: EventEmitter<any> = new EventEmitter();
}
