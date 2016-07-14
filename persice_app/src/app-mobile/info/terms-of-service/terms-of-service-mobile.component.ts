import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { TabNavigationComponent } from '../tab-navigation';
import { AppStateService } from '../../shared/services';
import { HeaderState } from '../../header';

@Component({
  selector: 'prs-mobile-terms-of-service',
  template: <any>require('./terms-of-service-mobile.html'),
  directives: [TabNavigationComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TermsOfServiceMobileComponent implements OnInit {

  constructor(private appStateService: AppStateService) { }

  ngOnInit() {
    this.appStateService.headerStateEmitter.emit(HeaderState.onlyMenu);
  }
}
