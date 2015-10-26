/// <reference path="../../../typings/_custom.d.ts" />

import {Component, NgIf} from 'angular2/angular2';

let view = require('./loading.html');
@Component({
  inputs: ['status'],
  selector: 'loading',
  template: view,
  directives: [NgIf]
})
export class LoadingComponent {
  status: boolean;
  constructor() {
    this.status = false;
  }
}
