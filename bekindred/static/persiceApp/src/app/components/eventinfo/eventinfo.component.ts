/// <reference path="../../../typings/_custom.d.ts" />

import {Component, Input} from 'angular2/angular2';
import {DropdownDirective} from '../../directives/dropdown.directive';

let view = require('./eventinfo.html');

@Component({
  selector: 'event-info',
  template: view,
  directives: [DropdownDirective]
})
export class EventInfoComponent {
  @Input() info;

}
