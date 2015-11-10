/// <reference path="../../../typings/_custom.d.ts" />

import {Component} from 'angular2/angular2';
import {RouterLink } from 'angular2/router';

let view = require('./message.html');
@Component({
  selector: 'message',
  template: view,
  directives: [RouterLink]
})
export class MessageComponent {
  onInit() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }
}
