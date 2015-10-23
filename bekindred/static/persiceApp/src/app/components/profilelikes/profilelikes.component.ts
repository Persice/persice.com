/// <reference path="../../../typings/_custom.d.ts" />

import {Component, Input} from 'angular2/angular2';

let view = require('./profilelikes.html');

@Component({
  template: view,
  selector: 'profile-likes'
})
export class ProfileLikesComponent {
  @Input() user;
}
