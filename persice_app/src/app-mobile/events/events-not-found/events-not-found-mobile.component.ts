import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'prs-mobile-events-not-found',
  template: <any>require('./events-not-found-mobile.html'),
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventsNotFoundMobileComponent implements OnInit {
  constructor() { }

  ngOnInit() {

  }
}

