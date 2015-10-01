/// <reference path="../../../typings/_custom.d.ts" />

import {Component, View, Directive, ElementRef, Pipe, Injectable} from 'angular2/angular2';
import {Http, Headers, Response, HTTP_BINDINGS} from 'angular2/http';


let view = require('./profiledropdown.html');


@Component({
  selector: 'profile-dropdown'
})
@View({
  template: view
})
export class ProfileDropdownComponent {
  image: string;
  constructor(public http: Http) {
    this.http.get('/api/v1/me/?format=json')
      .toRx()
      .map(res => res.json())
      .subscribe(data => this.image = data.objects[0].image);
  }

  inInit() {

  }
}
