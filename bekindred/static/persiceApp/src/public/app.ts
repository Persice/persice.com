/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component, View, bootstrap} from 'angular2/angular2';

@Component({
  selector: 'persice-app'
})
@View({
  template: `
  <div>Hello {{name}}! Welcome to Angular 2.</div>
  `
})
export class PersiceApp {
  name: string;
  constructor() {
    this.name = 'world';
  }
}


bootstrap(PersiceApp)