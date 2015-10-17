/// <reference path="../../../typings/_custom.d.ts" />

import {Component} from 'angular2/angular2';
import {RouterLink } from 'angular2/router';

let view = require('./connectionpage.html');
@Component({
  selector: 'connection-page',
  template: view,
  directives: [RouterLink]
})
export class ConnectionPageComponent {
  constructor() {

  }
}
