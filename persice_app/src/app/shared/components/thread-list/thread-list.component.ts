import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ThreadComponent } from './thread.component';
import {Conversation} from '../../../../common/models/conversation/conversation.model';

@Component({
  selector: 'prs-thread-list',
  template: `
  <prs-thread *ngFor="let item of threads"
              [thread]="item"
              [isActive]="active.id === item.id"
              (selected)="selected.next($event)">
  </prs-thread>
  `,
  directives: [ ThreadComponent ]
})
export class ThreadListComponent {
  @Input() threads: Conversation[];
  @Input() active: Conversation;
  @Output() selected: EventEmitter<any> = new EventEmitter();
}
