import {Component, ChangeDetectionStrategy, OnInit} from '@angular/core';

import {TabNavigationComponent} from '../tab-navigation';
import {AppStateService} from '../../shared/services';
import {HeaderState} from '../../header';

@Component({
  selector: 'prs-mobile-privacy-policy',
  template: require('./privacy-policy-mobile.html'),
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [TabNavigationComponent]
})
export class PrivacyPolicyMobileComponent implements OnInit {
  constructor(private appStateService: AppStateService) { }
  ngOnInit() {
    this.appStateService.headerStateEmitter.emit(HeaderState.onlyMenu);
  }
}
