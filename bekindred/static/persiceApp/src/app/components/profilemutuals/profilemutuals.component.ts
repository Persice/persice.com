import {Component, Input, NgFor, NgStyle, NgIf} from 'angular2/angular2';
import {SlickDirective} from '../../directives/slick.directive';

let view = require('./profilemutuals.html');

@Component({
  template: view,
  selector: 'profile-mutuals',
  directives: [SlickDirective, NgFor, NgStyle, NgIf]
})
export class ProfileMutualsComponent {
  @Input() mutuals;
  @Input() count;
}
