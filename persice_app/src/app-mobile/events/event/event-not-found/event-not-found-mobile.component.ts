import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'prs-mobile-event-not-found',
  template: <any>require('./event-not-found-mobile.html'),
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventNotFoundMobileComponent implements OnInit {
  constructor() {}

  ngOnInit() {

  }
}

