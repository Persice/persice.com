/// <reference path="../../../typings/_custom.d.ts" />

import {Component, Input, NgFor} from 'angular2/angular2';
import {SlickDirective} from '../../directives/slick.directive';

let view = require('./profilemutuals.html');

@Component({
  template: view,
  selector: 'profile-mutuals',
  directives: [SlickDirective, NgFor]
})
export class ProfileMutualsComponent {
  @Input() mutuals;
}