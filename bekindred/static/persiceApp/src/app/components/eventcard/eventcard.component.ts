/// <reference path="../../../typings/_custom.d.ts" />

import {Component, NgIf, NgStyle} from 'angular2/angular2';
import {RouterLink} from 'angular2/router';

import {DateUtil} from '../../core/util';

let view = require('./eventcard.html');

@Component({
  inputs: ['event'],
  selector: 'event-card',
  template: view,
  directives: [NgIf, NgStyle, RouterLink]
})
export class EventCardComponent {
  event: any;
  photo: string = '/static/img/placeholder-image.jpg';
  date: string = '';

  onInit() {
    if (this.event.event_photo !== null) {
      this.photo = this.event.event_photo;
    }

    this.date = DateUtil.format(this.event.starts_on, 'ddd, D MMM YYYY');
  }

}
