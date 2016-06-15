import {Component, ChangeDetectionStrategy, Output, EventEmitter, OnDestroy, OnInit}
from '@angular/core';

@Component({
  selector: 'prs-mobile-network',
  template: require('./network.html'),
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NetworkComponent implements OnInit, OnDestroy {
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  @Output() onOpen: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): any {

  }

  ngOnDestroy(): any {

  }
}
