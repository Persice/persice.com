import { Component, Input } from '@angular/core';

@Component({
  selector: 'prs-conversation-header',
  templateUrl: './conversation-header.html'
})
export class ConversationHeaderComponent {
  @Input() name: string;
}
