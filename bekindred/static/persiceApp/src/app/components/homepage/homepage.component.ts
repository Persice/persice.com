/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive, ElementRef} from 'angular2/angular2';

let view = require('./homepage.html');
@Component({
  selector: 'home-page'
})
@View({
  template: view
})
export class HomePageComponent {
  constructor() {

  }
}
