import {Component, Input} from 'angular2/core';

let view = require('./loading.html');
@Component({
  selector: 'loading',
  template: view
})
export class LoadingComponent {
  @Input() status;
}
