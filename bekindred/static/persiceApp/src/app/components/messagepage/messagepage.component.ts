/// <reference path="../../../typings/_custom.d.ts" />

import {Component} from 'angular2/angular2';
import {RouterLink } from 'angular2/router';

let view = require('./messagepage.html');
@Component({
  selector: 'message-page',
  template: view,
  directives: [RouterLink]
})
export class MessagePageComponent {
  constructor() {

  }

  onInit() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }
}
