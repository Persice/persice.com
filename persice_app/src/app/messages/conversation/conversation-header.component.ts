import {Component, Input} from 'angular2/core';

import {DropdownDirective} from '../../shared/directives';

@Component({
  selector: 'prs-conversation-header',
  directives: [
    DropdownDirective
  ],
  template: require('./conversation-header.html')
})
export class ConversationHeaderComponent {
  @Input() name;
}
