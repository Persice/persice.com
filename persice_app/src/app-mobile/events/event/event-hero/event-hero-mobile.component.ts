import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { CheckImageDirective } from '../../../../app/shared/directives';
import { EventDescriptionMobileComponent } from './event-description';
import { Event } from '../../../shared/model/event';

@Component({
  selector: 'prs-mobile-event-hero',
  template: <any>require('./event-hero-mobile.html'),
  directives: [CheckImageDirective, EventDescriptionMobileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventHeroMobileComponent implements OnInit {
  @Input() event: Event;

  constructor() {}

  ngOnInit() {

  }
}

