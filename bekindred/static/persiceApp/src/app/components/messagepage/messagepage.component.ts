/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive, ElementRef} from 'angular2/angular2';
import {RouterLink } from 'angular2/router';

let view = require('./messagepage.html');
@Component({
  selector: 'message-page'
})
@View({
  template: view,
  directives: [RouterLink]
})
export class MessagePageComponent {
  constructor() {

  }
}
