/// <reference path="../../../typings/_custom.d.ts" />

import {Component, Input} from 'angular2/angular2';
import {SlickDirective} from '../../directives/slick.directive';

let view = require('./eventpeople.html');

@Component({
  selector: 'event-people',
  template: view,
  directives: [
    SlickDirective
  ]
})
export class EventPeopleComponent {
  @Input() people;

}
