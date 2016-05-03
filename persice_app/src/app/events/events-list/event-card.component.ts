import {Component, ChangeDetectionStrategy, Input, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router-deprecated';

import {DateUtil} from '../../shared/core';
import {CheckImageDirective} from '../../shared/directives';

@Component({
  selector: 'prs-event-card',
  template: require('./event-card.html'),
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [RouterLink, CheckImageDirective]
})
export class EventCardComponent implements OnInit {
  @Input () event: any;
  photo: string = '/static/img/placeholder-image.png';
  date: string = '';
  distanceValue = '';
  distanceUnit = '';

  ngOnInit() {
    if (this.event.event_photo !== null && this.event.event_photo !== '/media/null') {
      this.photo = this.event.event_photo;
    }

    if (this.event.distance !== null) {
      this.distanceValue = parseFloat(this.event.distance[0]).toFixed(0);
      this.distanceUnit = this.event.distance[1];
    }


    this.date = DateUtil.format(this.event.starts_on, 'ddd, D MMM YYYY');
  }

}
