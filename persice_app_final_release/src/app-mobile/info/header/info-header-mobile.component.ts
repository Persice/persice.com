import { Component } from '@angular/core';

@Component({
  selector: 'prs-mobile-info-header',
  templateUrl: './info-header-mobile.html'
})
export class InfoHeaderMobileComponent {
  isCordova = 'enabled' === CORDOVA_BUILD;
}
