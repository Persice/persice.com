import {Component, Input} from 'angular2/core';

import {DropdownDirective} from '../../directives/dropdown.directive';

@Component({
  selector: 'messages-header',
  directives: [
    DropdownDirective
  ],
  template: require('./messages_header.html')
})
export class MessagesHeaderComponent {
  @Input() name;
  constructor() {

  }


  ngOnInit() {
  }
}
