import { Component, Input } from '@angular/core';

@Component({
  selector: 'prs-conversations-header',
  templateUrl: './conversations-header.html'
})
export class ConversationsHeaderComponent {
  @Input() counter: number;
}
