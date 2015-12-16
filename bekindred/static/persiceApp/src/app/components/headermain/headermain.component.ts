import {Component} from 'angular2/core';

import {NavMainComponent} from '../navmain/navmain.component';
import {LogoComponent} from '../logo/logo.component';

let view = require('./headermain.html');
@Component({
  selector: 'header-main',
  directives: [NavMainComponent, LogoComponent],
  template: view
})
export class HeaderMainComponent {

}
