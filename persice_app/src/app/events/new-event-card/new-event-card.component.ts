import { Component, OnDestroy } from '@angular/core';
import { RemodalDirective } from '../../shared/directives';
import { EventCreateComponent } from '../event/event-create.component';

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




