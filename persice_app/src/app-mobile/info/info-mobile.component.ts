import {Component} from '@angular/core';
import {RouteConfig, RouterOutlet} from '@angular/router-deprecated';

import {TermsOfServiceMobileComponent} from './terms-of-service';
import {PrivacyPolicyMobileComponent} from './privacy-policy';
import {TabNavigationMobileComponent} from './tab-navigation';

@Component({
  selector: 'prs-mobile-info',
  template: `
    <prs-mobile-tab-navigation></prs-mobile-tab-navigation>
    <div class="mob-type">
      <router-outlet></router-outlet>
    </div>
  `,
  directives: [RouterOutlet, TabNavigationMobileComponent]
})
@RouteConfig([
  {
    path: '/privacy-policy',
    component: PrivacyPolicyMobileComponent,
    name: 'PrivacyPolicy',
    useAsDefault: true
  },
  {
    path: '/terms-of-service',
    component: TermsOfServiceMobileComponent,
    name: 'TermsOfService'
  },
])
export class InfoMobileComponent { }
