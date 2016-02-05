import {Component, Input, Output, ChangeDetectionStrategy, EventEmitter} from 'angular2/core';

@Component({
  selector: 'thread-single',
  template: `
  <div class="message" [ngClass]="{'is-active': isActive === thread.threadId, 'is-unread': thread.unread === true}" (click)="onSelect(thread)">
    <div class="flag flag--responsive flag--small">
      <div class="flag__img">
        <span class="message__inread-indicator"></span>
        <div class="avatar avatar--medium">
          <div class="avatar-holder"
          [ngStyle]="{'background-image': 'url(' + thread.image + ')'}">
          </div>
        </div>
      </div>
      <div class="flag__body">
        <div class="message__name">{{thread.name}}</div>
        <div class="message__text truncate">{{thread.body}}</div>
        <div class="message__time">{{thread.sentAt}}</div>
        <div class="message__total" [ngClass]="{'is-visible': thread.unreadCounter > 0}">{{thread.unreadCounter}}</div>
      </div>
    </div>
  </div>
	`
})
export class ThreadSingleComponent {
  @Input() thread;
  @Input() isActive;
  @Output() selected: EventEmitter<any> = new EventEmitter();

  onSelect(thread) {
    if (this.isActive !== thread.threadId) {
      this.selected.next(thread);
    }

  }
}
