/// <reference path="../../../typings/_custom.d.ts" />

import {Component, Input} from 'angular2/angular2';

let view = require('./profilefeatures.html');

@Component({
  template: view,
  selector: 'profile-features'
})
export class ProfileFeaturesComponent {
  @Input() user;
}
