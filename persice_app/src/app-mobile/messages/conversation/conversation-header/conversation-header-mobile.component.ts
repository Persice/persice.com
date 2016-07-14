import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'prs-mobile-conversation-header',
  template: <any>require('./conversation-header-mobile.html'),
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConversationHeaderMobileComponent {
  @Input() title: string;
}
