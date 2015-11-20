/// <reference path="../../../typings/_custom.d.ts" />

import {Component, NgIf, NgFor, NgStyle} from 'angular2/angular2';


let view = require('./eventcard.html');

@Component({
  inputs: ['event'],
  selector: 'event-card',
  template: view,
  directives: [NgIf, NgFor, NgStyle]
})
export class EventCardComponent {
  event: any;

}




