/// <reference path="../../../typings/_custom.d.ts" />

import {Component, Input} from 'angular2/angular2';

let view = require('./eventphotomap.html');

@Component({
  selector: 'event-photomap',
  template: view
})
export class EventPhotoMapComponent {
  @Input() location;
  @Input() photo;

}
