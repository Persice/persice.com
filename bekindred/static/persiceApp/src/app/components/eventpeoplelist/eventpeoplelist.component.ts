/// <reference path="../../../typings/_custom.d.ts" />

import {Component, Input, NgFor, NgStyle, NgIf} from 'angular2/angular2';
import {SlickDirective} from '../../directives/slick.directive';

let view = require('./eventpeoplelist.html');

@Component({
  template: view,
  selector: 'event-peoplelist',
  directives: [SlickDirective, NgFor, NgStyle, NgIf]
})
export class EventPeopleListComponent {
  @Input() people;
  @Input() count;
}
