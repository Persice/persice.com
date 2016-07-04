import {Component, OnInit, OnDestroy} from '@angular/core';
import {AppStateService} from '../../shared/services/app-state.service';
import {HeaderState} from '../../header/header.state';

@Component({
  selector: 'prs-mobile-event',
  template: require('./event-mobile.html'),
})
export class EventMobileComponent implements OnInit, OnDestroy {


  constructor(
    private appStateService: AppStateService
  ) {

  }

  ngOnInit(): any {
    this.appStateService.headerStateEmitter.emit(HeaderState.event);
  }

  ngOnDestroy(): any {
  }

}
