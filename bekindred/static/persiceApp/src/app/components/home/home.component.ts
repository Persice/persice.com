/// <reference path="../../../typings/_custom.d.ts" />

import {Component} from 'angular2/angular2';

let view = require('./home.html');
@Component({
  selector: 'home',
  template: view
})
export class HomeComponent {

  ngOnInit() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }
}
