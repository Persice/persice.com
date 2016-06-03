import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {RouterLink} from '@angular/router-deprecated';

@Component({
  selector: 'prs-mobile-conversation-header',
  template: require('./conversation-header-mobile.html'),
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [RouterLink]
})
export class ConversationHeaderMobileComponent {
  @Input() title: string;
}
