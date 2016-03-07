import {Component} from 'angular2/core';

let view = require('./loading.html');
@Component({
  inputs: ['status'],
  selector: 'loading',
  template: view
})
export class LoadingComponent {
  status: boolean = false;
}
