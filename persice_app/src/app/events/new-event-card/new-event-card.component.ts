import {Component, OnDestroy} from '@angular/core';

import {EventCreateComponent} from '../../event';
import {RemodalDirective} from '../../shared/directives';

@Component({
  selector: 'prs-new-event-card',
  template: <any>require('./new-event-card.html'),
  directives: [
    EventCreateComponent,
    RemodalDirective
  ]
})
export class NewEventCardComponent implements OnDestroy {

  ngOnDestroy() {
    jQuery('select.js-select-rep-create-event').minimalect('destroy');
  }
}




