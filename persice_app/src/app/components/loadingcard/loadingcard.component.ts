import {Component, Input} from 'angular2/core';
import {CircleProgressDirective} from '../../directives/circleprogress.directive';

let view = require('./loadingcard.html');
@Component({
  selector: 'loading-card',
  template: view,
  directives: [CircleProgressDirective]
})
export class LoadingCardComponent {
}
