/// <reference path="../../../typings/_custom.d.ts" />

import {Component, Input} from 'angular2/angular2';

let view = require('./eventpeople.html');

@Component({
  selector: 'event-people',
  template: view
})
export class EventPeopleComponent {
  @Input() people;

}
