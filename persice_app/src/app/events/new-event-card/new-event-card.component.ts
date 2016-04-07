import {Component} from 'angular2/core';

import {EventCreateComponent} from '../event';
import {RemodalDirective} from '../../shared/directives';

@Component({
  selector: 'prs-new-event-card',
  template: require('./new-event-card.html'),
  directives: [
    EventCreateComponent,
    RemodalDirective
  ]
})
export class NewEventCardComponent {


  ngOnDestroy() {
    jQuery('select.js-select-rep-create-event').minimalect('destroy');
  }
}




