/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive, ElementRef, Pipe, Injectable, NgStyle} from 'angular2/angular2';
import {Http, Headers, Response, HTTP_BINDINGS} from 'angular2/http';

import {DropdownDirective} from '../../directives/dropdown.directive';

let view = require('./profiledropdown.html');

@Component({
  selector: 'profile-dropdown',
  inputs: ['image'],
  template: view,
  directives: [DropdownDirective, NgStyle]
})
export class ProfileDropdownComponent {
  constructor(public http: Http) {

  }
}
