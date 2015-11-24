/// <reference path="../../../typings/_custom.d.ts" />

import {Component, Input} from 'angular2/angular2';

let view = require('./eventhost.html');

@Component({
  selector: 'event-host',
  template: view
})
export class EventHostComponent {
  @Input() host;

}
