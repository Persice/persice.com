import {Component, ChangeDetectionStrategy} from '@angular/core';
import {RouterLink} from '@angular/router-deprecated';


@Component({
  selector: 'prs-mobile-terms-of-service',
  template: require('./terms-of-service-mobile.html'),
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [RouterLink]
})
export class TermsOfServiceMobileComponent { }
