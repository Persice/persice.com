import {Component, Input, ChangeDetectionStrategy, Output, EventEmitter} from '@angular/core';
import {LoadingComponent} from '../../../../app/shared/components/loading';
import {CheckImageDirective} from '../../../../app/shared/directives';
import {InfiniteScrollReverseDirective} from '../../../../common/directives';

@Component({
  selector: 'prs-mobile-conversation-messages',
  template: require('./conversation-messages-mobile.html'),
  directives: [LoadingComponent, CheckImageDirective, InfiniteScrollReverseDirective],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConversationMessagesMobileComponent {
  @Input() messages;
  @Input() loading;
  @Input() loaded;
  @Input() loadedCount;
  @Input() totalCount;

  @Output() onScrollTop: EventEmitter<any> = new EventEmitter();

}
