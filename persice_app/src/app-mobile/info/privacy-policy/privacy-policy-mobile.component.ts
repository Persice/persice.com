import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TabNavigationComponent } from '../tab-navigation';
import { InfoHeaderMobileComponent } from '../header';

@Component({
  selector: 'prs-mobile-privacy-policy',
  template: <any>require('./privacy-policy-mobile.html'),
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [TabNavigationComponent, InfoHeaderMobileComponent]
})
export class PrivacyPolicyMobileComponent {
  constructor() { }

}
