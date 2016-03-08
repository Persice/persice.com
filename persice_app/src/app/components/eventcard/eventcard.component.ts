import {Component, ChangeDetectionStrategy, Input} from 'angular2/core';
import {RouterLink} from 'angular2/router';

import {DateUtil} from '../../core/util';

let view = require('./eventcard.html');

@Component({
  selector: 'event-card',
  template: view,
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [RouterLink]
})
export class EventCardComponent {
  @Input () event: any;
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