/// <reference path="../../../typings/_custom.d.ts" />

import {Component, Input} from 'angular2/angular2';

let view = require('./profilemutuals.html');

@Component({
  template: view,
  selector: 'profile-mutuals'
})
export class ProfileMutualsComponent {
  @Input() mutuals;
}
