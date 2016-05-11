import {Component} from '@angular/core';
import {RouterLink} from '@angular/router-deprecated';

@Component({
  selector: 'prs-mobile-navigation',
  template: require('./navigation-mobile.html'),
  directives: [RouterLink]
})
export class NavigationMobileComponent {

}
