/// <reference path="../../../typings/_custom.d.ts" />

import {Component, Input, NgFor} from 'angular2/angular2';
import {SlickDirective} from '../../directives/slick.directive';

let view = require('./profilelikes.html');

@Component({
  template: view,
  selector: 'profile-likes',
  directives: [SlickDirective, NgFor]
})
export class ProfileLikesComponent {
  @Input() likes;
}
