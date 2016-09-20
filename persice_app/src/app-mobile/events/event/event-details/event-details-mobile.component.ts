import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Event } from '../../../../common/models/event/index';
import { UrlDomainPipe } from '../../../../common/pipes/url-domain.pipe';

@Component({
  selector: 'prs-mobile-event-details',
  template: <any>require('./event-details-mobile.html'),
  pipes: [UrlDomainPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventDetailsMobileComponent implements OnInit {
  @Input() event: Event;

  constructor() {
  }

  ngOnInit() {

  }
}

