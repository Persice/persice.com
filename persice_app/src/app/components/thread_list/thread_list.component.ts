import {Component, Input, Output, ChangeDetectionStrategy, EventEmitter} from 'angular2/core';

/**
 * Components
 */
import {ThreadSingleComponent} from '../thread_single/thread_single.component';

@Component({
  selector: 'thread-list',
  template: `
  <thread-single [isActive]="active" (selected)="selected.next($event)" *ngFor="#item of threads" [thread]="item"></thread-single>
  `,
  directives: [
    ThreadSingleComponent
  ]
})
export class ThreadListComponent {
  @Input() threads;
  @Input() active;
  @Output() selected: EventEmitter<any> = new EventEmitter();
}
