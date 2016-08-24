import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { DateUtil } from '../../../common/core';
import { CheckImageDirective } from '../../shared/directives';

@Component({
  selector: 'prs-event-card',
  template: <any>require('./event-card.html'),
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [ROUTER_DIRECTIVES, CheckImageDirective]
})
export class EventCardComponent implements OnInit {
  @Input() event: any;
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
