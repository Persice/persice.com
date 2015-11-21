/// <reference path="../../../typings/_custom.d.ts" />

import {Component, EventEmitter} from 'angular2/angular2';
let view = require('./neweventcard.html');

@Component({
  outputs: ['onClick'],
  selector: 'newevent-card',
  template: view
})
export class NewEventCardComponent {

  onClick: EventEmitter<any> = new EventEmitter;

  userClicked() {
    this.onClick.next(true);
  }

}




