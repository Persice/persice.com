import {Component} from '@angular/core';
import {RouterLink} from '@angular/router-deprecated';

@Component({
  selector: 'prs-mobile-tab-navigation',
  directives: [RouterLink],
  template: `
    <ul class="mob-tabs">
      <li><a [routerLink]="['PrivacyPolicy']">Privacy Policy</a></li>
      <li><a [routerLink]="['TermsOfService']">Terms of service</a></li>
    </ul>
  `
})
export class TabNavigationMobileComponent { }
