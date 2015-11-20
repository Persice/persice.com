/// <reference path="../../../typings/_custom.d.ts" />

import {Component, NgIf, NgFor, EventEmitter, NgStyle} from 'angular2/angular2';


let view = require('./neweventcard.html');

@Component({
  outputs: ['onClick'],
  selector: 'newevent-card',
  template: view,
  directives: [NgIf, NgFor, NgStyle]
})
export class NewEventCardComponent {

  onClick: EventEmitter<any> = new EventEmitter;

  userClicked() {
    this.onClick.next(true);
  }

}




