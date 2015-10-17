/// <reference path="../../../typings/_custom.d.ts" />

import {Component} from 'angular2/angular2';

let view = require('./homepage.html');
@Component({
  selector: 'home-page',
  template: view
})
export class HomePageComponent {
  constructor() {

  }
}
