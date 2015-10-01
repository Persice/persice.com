/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive, ElementRef} from 'angular2/angular2';

let view = require('./usercard.html');

@Component({
  selector: 'user-card'
})
@View({
  directives: [],
  template: view
})
export class UserCardComponent {
  constructor() {

  }
}
