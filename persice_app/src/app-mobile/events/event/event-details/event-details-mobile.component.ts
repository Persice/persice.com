import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Event } from '../../../shared/model/event';

@Component({
  selector: 'prs-mobile-event-details',
  template: <any>require('./event-details-mobile.html'),
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventDetailsMobileComponent implements OnInit {
  @Input() event: Event;

  constructor() {
  }

  ngOnInit() {

  }
}

