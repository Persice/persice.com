import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
  selector: 'prs-mobile-navigation',
  template: require('./navigation-mobile.html'),
  directives: [
    ROUTER_DIRECTIVES
  ]
})
export class NavigationMobileComponent {

}
