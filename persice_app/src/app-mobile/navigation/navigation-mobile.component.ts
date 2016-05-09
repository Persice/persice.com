import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';

@Component({
  selector: 'prs-mobile-navigation',
  template: require('./navigation-mobile.html'),
  directives: [
    ROUTER_DIRECTIVES
  ]
})
export class NavigationMobileComponent {

}
