/// <reference path="../../../typings/_custom.d.ts" />

import {Component, Input} from 'angular2/angular2';

let view = require('./eventinfo.html');

@Component({
  selector: 'event-info',
  template: view
})
export class EventInfoComponent {
  @Input() info;

}
