import {Component, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'prs-mobile-privacy-policy',
  template: require('./privacy-policy-mobile.html'),
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrivacyPolicyMobileComponent { }
