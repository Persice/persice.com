import {Component, Input} from '@angular/core';

import {SearchComponent} from './search.component';
import {DropdownComponent} from './dropdown.component';

@Component({
  selector: 'prs-header',
  directives: [
    DropdownComponent,
    SearchComponent
  ],
  template: <any>require('./header.html')
})
export class HeaderComponent {
  @Input() image: string;
}
