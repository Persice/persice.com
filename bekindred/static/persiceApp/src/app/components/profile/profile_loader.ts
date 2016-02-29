import {Component, DynamicComponentLoader, ElementRef} from 'angular2/core';
import {RouteParams, Router} from 'angular2/router';

import {ProfileViewComponent} from './profile_view.component';
import {ProfileMyComponent} from './profile_my.component';

import {CookieUtil} from '../../core/util';

@Component({
  selector: 'profile-loader',
  template: `<div #child></div>`,
  directives: [
    ProfileMyComponent,
    ProfileViewComponent
  ]
})
export class ProfileLoader {
  username;
  usernameParam;

  constructor(
    private _loader: DynamicComponentLoader,
    private _el: ElementRef,
    private _params: RouteParams
    ) {
    this.username = CookieUtil.getValue('user_username');
    this.usernameParam = this._params.get('username');
  }

  ngOnInit() {

    if (this.username === this.usernameParam) {
      this._loader.loadIntoLocation(ProfileMyComponent, this._el, 'child')
      .then((res) => {

      });
    }
    else {
      this._loader.loadIntoLocation(ProfileViewComponent, this._el, 'child')
      .then((res) => {
        res.instance.setUsername(this.usernameParam);
      });
    }
  }
}
