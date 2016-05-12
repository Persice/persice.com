import {Component} from '@angular/core';
import {RouterLink} from '@angular/router-deprecated';
import {CookieUtil} from "../../app/shared/core/util";
@Component({
  selector: 'prs-mobile-navigation',
  template: require('./navigation-mobile.html'),
  directives: [RouterLink]
})
export class NavigationMobileComponent {
  public username: string;

  constructor() {
    this.username = CookieUtil.getValue('user_username');
  }
}
