/// <reference path="../../../typings/_custom.d.ts" />

import {Component, NgIf} from 'angular2/angular2';

let view = require('./loadingindicator.html');
@Component({
  inputs: ['status'],
  selector: 'loading-indicator',
  template: view,
  directives: [NgIf]
})
export class LoadingIndicatorComponent {
  status: boolean;
  constructor() {
    this.status = false;
  }
}
