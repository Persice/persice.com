/// <reference path="../../../typings/_custom.d.ts" />
import {Component, EventEmitter, NgZone} from 'angular2/angular2';

import {RemodalDirective} from '../../directives/remodal.directive';

declare var jQuery: any;

let view = require('./neweventcard.html');

@Component({
  outputs: ['onClick'],
  selector: 'newevent-card',
  template: view,
  directives: [RemodalDirective]
})
export class NewEventCardComponent {

  onClick: EventEmitter<any> = new EventEmitter;
  zone: NgZone;
  remodal = null;

  constructor(zone: NgZone) {
    this.zone = zone;
  }

  userClicked() {
    this.onClick.next(true);
  }

  saveEvent(event) {
    console.log('Save event');
  }

  onInit() {


  }

  onDestroy() {

  }

}




