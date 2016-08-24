import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CheckImageDirective } from '../../directives';
import { MarkupPipe } from '../../pipes/markup.pipe';

@Component({
  selector: 'prs-thread',
  directives: [CheckImageDirective],
  pipes: [
    MarkupPipe
  ],
  template: `
  <div class="message" [ngClass]="{'is-active': isActive === thread.threadId, 'is-unread': thread.unread === true}" (click)="onSelect(thread)">
    <div class="flag flag--responsive flag--small">
      <div class="flag__img">
        <span class="message__inread-indicator"></span>
        <div class="avatar avatar--medium">
          <div class="avatar-holder"
          checkimage="{{thread.image}}" [suffix]="'.56x56_q100_crop.jpg'">
          </div>
        </div>
      </div>
      <div class="flag__body">
        <div class="message__name">{{thread.name}}</div>
        <div class="message__text truncate" [innerHTML]="thread.body | markup:false">{{thread.body}}</div>
        <div class="message__time">{{thread.sentAt}}</div>
        <div class="message__total" [ngClass]="{'is-visible': thread.unreadCounter > 0}">{{thread.unreadCounter}}</div>
      </div>
    </div>
  </div>
  `
})
export class ThreadComponent {
  @Input() thread;
  @Input() isActive;
  @Output() selected: EventEmitter<any> = new EventEmitter();

  onSelect(thread) {
    if (this.isActive !== thread.threadId) {
      this.selected.next(thread);
    }

  }
}
