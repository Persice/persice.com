/// <reference path="../../../typings/_custom.d.ts" />

import {Component, NgIf} from 'angular2/angular2';

let view = require('./loadingcard.html');
@Component({
  inputs: ['status'],
  selector: 'loading-card',
  template: view,
  directives: [NgIf]
})
export class LoadingCardComponent {
  status: boolean;
  constructor() {
    this.status = false;
  }
}
