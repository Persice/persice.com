/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive, ElementRef, Pipe, Injectable} from 'angular2/angular2';
import {Http, Headers, Response, HTTP_BINDINGS} from 'angular2/http';

import {DropdownDirective} from '../../directives/dropdown.directive';

let view = require('./profiledropdown.html');

const mediaFolder = '/media/';

@Component({
  selector: 'profile-dropdown',
  inputs: ['image']
})
@View({
  template: view,
  directives: [DropdownDirective]
})
export class ProfileDropdownComponent {
  image: string;
  constructor(public http: Http) {
    // fix for undefined image while it loads from server
    this.image = '';

  }
}
