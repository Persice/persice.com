import {Component, OnInit} from '@angular/core';
import {AppStateService} from '../../shared/services/app-state.service';
import {HeaderState} from '../../header/header.state';

@Component({
  selector: 'prs-mobile-attendees',
  template: require('./attendees-mobile.html')
})
export class AttendeesMobileComponent implements OnInit {

  constructor(private appStateService: AppStateService) {
  }

  ngOnInit(): any {
    this.appStateService.headerStateEmitter.emit(HeaderState.attendees);
  }

}
