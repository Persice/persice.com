/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive} from 'angular2/angular2';
import { RouterOutlet, RouterLink } from 'angular2/router';

let view = require('./logo.html');

@Component({
  selector: 'logo'
})
@View({
  template: view,
  directives: [RouterOutlet, RouterLink]
})
export class LogoComponent {
  constructor() {

  }
}
