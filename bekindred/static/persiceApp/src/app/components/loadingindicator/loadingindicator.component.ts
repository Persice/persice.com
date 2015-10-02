/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive, NgIf} from 'angular2/angular2';

let view = require('./loadingindicator.html');
@Component({
  properties: ['status'],
  selector: 'loading-indicator'
})
@View({
  template: view,
  directives: [NgIf]
})
export class LoadingIndicatorComponent {
  status: boolean;
  constructor() {
    this.status = false;
  }
}
