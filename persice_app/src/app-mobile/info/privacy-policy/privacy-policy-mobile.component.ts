import {Component, ChangeDetectionStrategy} from '@angular/core';
import {RouterLink} from '@angular/router-deprecated';

@Component({
  selector: 'prs-mobile-privacy-policy',
  template: require('./privacy-policy-mobile.html'),
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [RouterLink]
})
export class PrivacyPolicyMobileComponent { }
