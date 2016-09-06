import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TabNavigationComponent } from '../tab-navigation';
import { InfoHeaderMobileComponent } from '../header';

@Component({
  selector: 'prs-mobile-terms-of-service',
  template: <any>require('./terms-of-service-mobile.html'),
  directives: [TabNavigationComponent, InfoHeaderMobileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TermsOfServiceMobileComponent {

  constructor() { }
}
