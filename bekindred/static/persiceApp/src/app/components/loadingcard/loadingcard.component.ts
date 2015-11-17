/// <reference path="../../../typings/_custom.d.ts" />

import {Component, NgIf} from 'angular2/angular2';
import {CircleProgressDirective} from '../../directives/circleprogress.directive';

let view = require('./loadingcard.html');
@Component({
  inputs: ['status'],
  selector: 'loading-card',
  template: view,
  directives: [NgIf, CircleProgressDirective]
})
export class LoadingCardComponent {
  status: boolean = false;
}
