import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { LoadingComponent } from '../../../../app/shared/components/loading';
import { CheckImageDirective } from '../../../../app/shared/directives';
import { InfiniteScrollReverseDirective } from '../../../../common/directives';
import { MarkupPipe } from '../../../../app/shared/pipes/markup.pipe';
import { ConversationMessageMobileComponent } from '../conversation-message/conversation-message-mobile.component';

@Component({
  selector: 'prs-mobile-conversation-messages',
  template: <any>require('./conversation-messages-mobile.html'),
  directives: [LoadingComponent, CheckImageDirective, InfiniteScrollReverseDirective, ConversationMessageMobileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  pipes: [MarkupPipe]
})
export class ConversationMessagesMobileComponent {
  @Input() messages;
  @Input() loading;
  @Input() loaded;
  @Input() loadedCount;
  @Input() totalCount;

  @Output() onScrollTop: EventEmitter<any> = new EventEmitter();
}
