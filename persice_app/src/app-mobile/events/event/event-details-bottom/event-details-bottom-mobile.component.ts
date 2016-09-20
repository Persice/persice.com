import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Event } from '../../../../common/models/event/index';

@Component({
  selector: 'prs-mobile-event-details-bottom',
  template: <any>require('./event-details-bottom-mobile.html'),
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventDetailsBottomMobileComponent implements OnInit {
  @Input() event: Event;

  constructor() {
  }

  ngOnInit() {

  }
}

