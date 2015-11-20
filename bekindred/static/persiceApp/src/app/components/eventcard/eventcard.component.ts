/// <reference path="../../../typings/_custom.d.ts" />

import {Component, NgIf, NgStyle} from 'angular2/angular2';
import {MomentPipe} from '../../pipes/moment.pipe';
let view = require('./eventcard.html');

@Component({
  inputs: ['event'],
  selector: 'event-card',
  template: view,
  pipes: [MomentPipe],
  directives: [NgIf, NgStyle]
})
export class EventCardComponent {
  event: any;
  photo: string = '/static/img/placeholder-image.jpg';

  onInit() {
    if (this.event.event_photo !== null) {
      this.photo = this.event.event_photo;
    }
  }

}
