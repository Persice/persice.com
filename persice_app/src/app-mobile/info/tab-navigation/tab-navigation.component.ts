import {Component, ChangeDetectionStrategy} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

@Component({
  selector: 'prs-mobile-tab-navigation',
  template: `
  <ul class="mob-tabs">
    <li [routerLinkActive]="['mob-tabs__tab--current']">
      <a [routerLink]="['/privacy']">Privacy Policy</a>
    </li>
    <li [routerLinkActive]="['mob-tabs__tab--current']">
      <a [routerLink]="['/terms']">Terms of service</a>
    </li>
  </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [ROUTER_DIRECTIVES]
})
export class TabNavigationComponent { }
