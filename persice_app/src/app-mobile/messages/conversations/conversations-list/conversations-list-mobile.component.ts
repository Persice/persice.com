import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {LoadingComponent} from '../../../../app/shared/components/loading';
import {CheckImageDirective} from '../../../../app/shared/directives';

@Component({
  selector: 'prs-mobile-conversations-list',
  template: require('./conversations-list-mobile.html'),
  directives: [LoadingComponent, CheckImageDirective],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConversationsListMobileComponent {
  @Input() conversations;
  @Input() loading;

}
