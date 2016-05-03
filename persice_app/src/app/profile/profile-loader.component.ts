import {Component, DynamicComponentLoader, ElementRef, OnInit, ViewContainerRef}
from '@angular/core';
import {RouteParams, Router} from '@angular/router-deprecated';

import {ProfileViewComponent} from './profile-view.component';
import {ProfileMyComponent} from './profile-my.component';

import {CookieUtil} from '../shared/core';

@Component({
  selector: 'prs-profile-loader',
  template: `<div></div>`,
})
export class ProfileLoader implements OnInit {
  username: string;
  usernameParam: string;

  constructor(
    private _loader: DynamicComponentLoader,
    private _viewContainerRef: ViewContainerRef,
    private _params: RouteParams
  ) {
    this.username = CookieUtil.getValue('user_username');
    this.usernameParam = this._params.get('username');
  }

  ngOnInit() {
    if (this.username === this.usernameParam) {
      this._loader.loadNextToLocation(ProfileMyComponent, this._viewContainerRef)
        .then((res) => {

        });
    } else {
      this._loader.loadNextToLocation(ProfileViewComponent, this._viewContainerRef)
        .then((res) => {
          res.instance.setUsername(this.usernameParam);
        });
    }
  }
}
