/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive} from 'angular2/angular2';

let view = require('./logo.html');

@Component({
  selector: 'logo'
})
@View({
  template: view
})
export class LogoComponent {
  constructor() {

  }
}
