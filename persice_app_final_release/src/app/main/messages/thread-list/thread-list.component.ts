import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'prs-thread-list',
  template: `
  <prs-thread [isActive]="active" (selected)="selected.next($event)" *ngFor="let item of threads" [thread]="item"></prs-thread>
  `,
})
export class ThreadListComponent {
  @Input() threads;
  @Input() active;
  @Output() selected: EventEmitter<any> = new EventEmitter();
}
