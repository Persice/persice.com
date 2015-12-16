import {Component} from 'angular2/core';
import {CircleProgressDirective} from '../../directives/circleprogress.directive';

let view = require('./loadingcard.html');
@Component({
  inputs: ['status'],
  selector: 'loading-card',
  template: view,
  directives: [CircleProgressDirective]
})
export class LoadingCardComponent {
  status: boolean = false;
}
