import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { LoadingComponent } from '../../../../app/shared/components/loading';
import { CheckImageDirective } from '../../../../app/shared/directives';
import { InfiniteScrollDirective } from '../../../../common/directives';
import { TimeAgoPipe } from '../../../../common/pipes';
import { MarkupPipe } from '../../../../app/shared/pipes/markup.pipe';

@Component({
  selector: 'prs-mobile-conversations-list',
  template: <any>require('./conversations-list-mobile.html'),
  directives: [LoadingComponent, CheckImageDirective, InfiniteScrollDirective],
  pipes: [TimeAgoPipe, MarkupPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConversationsListMobileComponent {
  @Input() conversations;
  @Input() loading;
  @Input() loaded;
  @Output() onScrollBottom: EventEmitter<any> = new EventEmitter();
  @Output() onConversationClick: EventEmitter<any> = new EventEmitter();
}
