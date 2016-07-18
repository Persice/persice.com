import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { EventDescriptionMobileComponent } from './event-description';
import { Event } from '../../../shared/model/event';
import { DefaultImageDirective } from '../../../../common/directives/default-image.directive';

@Component({
  selector: 'prs-mobile-event-hero',
  template: <any>require('./event-hero-mobile.html'),
  directives: [EventDescriptionMobileComponent, DefaultImageDirective],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventHeroMobileComponent implements OnInit {
  @Input() event: Event;

  constructor() {}

  ngOnInit() {

  }
}

