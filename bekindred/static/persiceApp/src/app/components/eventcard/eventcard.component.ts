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
  photo: string = '/static/img/placeholder-image.png';
  date: string = '';
  distanceValue = '';
  distanceUnit = '';

  ngOnInit() {
    if (this.event.event_photo !== null) {
      this.photo = this.event.event_photo;
    }

    if (this.event.distance !== null) {
      this.distanceValue = parseFloat(this.event.distance[0]).toFixed(0);
      this.distanceUnit = this.event.distance[1];
    }


    this.date = DateUtil.format(this.event.starts_on, 'ddd, D MMM YYYY');
  }

}
