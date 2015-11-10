/// <reference path="../../../typings/_custom.d.ts" />

import {Component} from 'angular2/angular2';

let view = require('./events.html');
@Component({
  selector: 'events',
  template: view
})
export class EventsComponent {
  onInit() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }
}
