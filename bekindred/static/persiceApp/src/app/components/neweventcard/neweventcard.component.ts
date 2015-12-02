/// <reference path="../../../typings/_custom.d.ts" />
import {Component, EventEmitter, NgZone} from 'angular2/angular2';

import {RemodalDirective} from '../../directives/remodal.directive';
import {SelectDirective} from '../../directives/select.directive';

declare var jQuery: any;

let view = require('./neweventcard.html');

@Component({
  outputs: ['onClick'],
  selector: 'newevent-card',
  template: view,
  directives: [RemodalDirective, SelectDirective]
})
export class NewEventCardComponent {

  onClick: EventEmitter<any> = new EventEmitter;

  openTo: Array<Object> = [
    {
      'label': 'Only my connections (default)',
      'value': 'connections',
      'selected': true
    },
    {
      'label': 'Public (all Persice users)',
      'value': 'public',
      'selected': false
    },
    {
      'label': 'Private (only invited)',
      'value': 'private',
      'selected': false
    }
  ];

  constructor() {

  }

  userClicked() {
    this.onClick.next(true);
  }

  saveEvent(event) {
    console.log('Save event');
  }

  changeOpenTo(event) {
    console.log(event);
  }

  ngOnDestroy() {
    jQuery('select.js-select-rep-create-event').minimalect('destroy');
  }

}




