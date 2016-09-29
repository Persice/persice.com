import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'prs-mobile-conversations-list',
  templateUrl: './conversations-list-mobile.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConversationsListMobileComponent {
  @Input() conversations;
  @Input() loading;
  @Input() loaded;
  @Output() onScrollBottom: EventEmitter<any> = new EventEmitter();
  @Output() onConversationClick: EventEmitter<any> = new EventEmitter();
}
