/// <reference path="../../../typings/_custom.d.ts" />
import {Component, NgClass} from 'angular2/angular2';

import {EventCreateComponent} from '../event/event_create.component';
import {RemodalDirective} from '../../directives/remodal.directive';

declare var jQuery: any;

let view = require('./neweventcard.html');

@Component({
  selector: 'newevent-card',
  template: view,
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




