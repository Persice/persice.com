import {Component, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'prs-mobile-terms-of-service',
  template: require('./terms-of-service-mobile.html'),
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TermsOfServiceMobileComponent { }
