/// <reference path="../../../typings/_custom.d.ts" />

import {Component} from 'angular2/angular2';

let view = require('./eventspage.html');
@Component({
  selector: 'events-page',
  template: view
})
export class EventsPageComponent {
  constructor() {

  }
}
