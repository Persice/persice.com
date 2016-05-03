import {
  Component,
  Input,
  Output,
  ChangeDetectionStrategy,
  EventEmitter
} from '@angular/core';

import {ThreadComponent} from './thread.component';

@Component({
  selector: 'prs-thread-list',
  template: `
  <prs-thread [isActive]="active" (selected)="selected.next($event)" *ngFor="let item of threads" [thread]="item"></prs-thread>
  `,
  directives: [
    ThreadComponent
  ]
})
export class ThreadListComponent {
  @Input() threads;
  @Input() active;
  @Output() selected: EventEmitter<any> = new EventEmitter();
}
