import {Component, Input} from 'angular2/core';
import {SlickDirective} from '../../directives/slick.directive';

let view = require('./profilemutuals.html');

@Component({
  template: view,
  selector: 'profile-mutuals',
  directives: [SlickDirective]
})
export class ProfileMutualsComponent {
  @Input() mutuals;
  @Input() count;
}
