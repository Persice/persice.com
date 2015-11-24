/// <reference path="../../../typings/_custom.d.ts" />

import {Component, Input} from 'angular2/angular2';

let view = require('./eventdescription.html');

@Component({
  selector: 'event-description',
  template: view
})
export class EventDescriptionComponent {
  @Input() description;

}
