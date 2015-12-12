import {Component} from 'angular2/angular2';
import {RouterLink } from 'angular2/router';

let view = require('./logo.html');

@Component({
  selector: 'logo',
  template: view,
  directives: [RouterLink]
})
export class LogoComponent {
}
