import { Component, Input } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
  selector: 'prs-conversations-header',
  directives: [
    ROUTER_DIRECTIVES
  ],
  template: <any>require('./conversations-header.html')
})
export class ConversationsHeaderComponent {
  @Input() counter: number;
}
