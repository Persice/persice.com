import {Component, Input} from 'angular2/core';

let view = require('./eventhost.html');

@Component({
  selector: 'event-host',
  template: view
})
export class EventHostComponent {
  @Input() host;

}
