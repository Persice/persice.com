import { Component, Input } from '@angular/core';
import { DropdownDirective } from '../../shared/directives';

@Component({
  selector: 'prs-conversation-header',
  directives: [
    DropdownDirective
  ],
  template: <any>require('./conversation-header.html')
})
export class ConversationHeaderComponent {
  @Input() name: string;
}
