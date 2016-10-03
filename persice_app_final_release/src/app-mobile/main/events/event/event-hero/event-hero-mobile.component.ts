import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Event } from '../../../../../common/models/event';

@Component({
  selector: 'prs-mobile-event-hero',
  templateUrl: './event-hero-mobile.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventHeroMobileComponent implements OnInit {
  @Input() event: Event;

  constructor() {}

  ngOnInit() {

  }
}

