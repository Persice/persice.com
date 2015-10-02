/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive, ElementRef} from 'angular2/angular2';
import { RouterOutlet, RouterLink } from 'angular2/router';

let view = require('./eventspage.html');
@Component({
  selector: 'events-page'
})
@View({
  template: view,
  directives: [RouterOutlet, RouterLink]
})
export class EventsPageComponent {
  constructor() {

  }
}
