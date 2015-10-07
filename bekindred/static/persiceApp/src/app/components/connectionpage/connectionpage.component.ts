/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive, ElementRef, Inject} from 'angular2/angular2';
import { RouterOutlet, RouterLink } from 'angular2/router';

let view = require('./connectionpage.html');
@Component({
  selector: 'connection-page'
})
@View({
  template: view,
  directives: [RouterOutlet, RouterLink]
})
export class ConnectionPageComponent {
  constructor() {

  }
}
