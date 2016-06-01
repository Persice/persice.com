import {Component, Input, ChangeDetectionStrategy, Output, EventEmitter} from '@angular/core';
import {LoadingComponent} from '../../../../app/shared/components/loading';
import {CheckImageDirective} from '../../../../app/shared/directives';
import {InfiniteScrollDirective} from '../../../../common/directives';

@Component({
  selector: 'prs-mobile-conversations-list',
  template: require('./conversations-list-mobile.html'),
  directives: [LoadingComponent, CheckImageDirective, InfiniteScrollDirective],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConversationsListMobileComponent {
  @Input() conversations;
  @Input() loading;
  @Output() onScrollBottom: EventEmitter<any> = new EventEmitter();
}
