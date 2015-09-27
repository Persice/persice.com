/// <reference path="../typings/angular2/angular2.d.ts" />
/// <reference path="../typings/angular2/http.d.ts" />

import {Component, View, bootstrap} from 'angular2/angular2';
import {Http, HTTP_BINDINGS} from "angular2/http";


export class AuthUser {
  id: number;
  first_name: string;
  last_name: string;
  image_url: string;
  facebook_id: string;
  constructor(
    first_name: string,
    last_name: string,
    image_url: string,
    facebook_id: string,
    id: number
   ) {
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.image_url = image_url;
    this.facebook_id = facebook_id;
  }
}


@Component({
  selector: 'left-nav'
})
@View({
  template: `
  <header class="tableize__content header-main">
  <a class="site-logo " href="Persice"> <img alt="#" src="/static/persiceApp/src/public/images/logo.svg" class="site-logo__mark">
    <h1 class="site-logo__type">Persice</h1> </a>
  <nav class="nav-main">
    <ul>
      <li class="is-current">
        <a href="#">
          <svg role="img" class="icon icon--large">
            <use xlink:href="/static/persiceApp/src/public/icons/icons.svg#icon-crowd"></use>
          </svg> <span>Crowd</span></a>
      </li>
      <li>
        <a href="#">
          <svg role="img" class="icon icon--large">
            <use xlink:href="/static/persiceApp/src/public/icons/icons.svg#icon-messages"></use>
          </svg> <span>Message</span></a>
      </li>
      <li>
        <a href="#">
          <svg role="img" class="icon icon--large">
            <use xlink:href="/static/persiceApp/src/public/icons/icons.svg#icon-connections"></use>
          </svg> <span>Connection</span></a>
      </li>
      <li>
        <a href="#">
          <svg role="img" class="icon icon--large">
            <use xlink:href="/static/persiceApp/src/public/icons/icons.svg#icon-events"></use>
          </svg> <span>Events</span></a>
      </li>
    </ul>
  </nav>
  </header>
  `
})
class LeftNav {
  constructor() {

  }
}

@Component({
  selector: 'top-header'
})
@View({
  template: `
  <header class="header-sub">
  <div class="tableize">
    <div class="tableize__cell tableize__cell--fill">
      <div class="tableize__content">
        <div class="search search--spaced">
          <div class="search__top">
            <svg role="img" class="icon icon--large">
              <use xlink:href="/static/persiceApp/src/public/icons/icons.svg#icon-search"></use>
            </svg>
            <input type="text" class="search__input" placeholder="Search"> </div>
          <div class="has-search__drop">
            <div class="search__drop">
              <h3 class="search__drop__title">Users</h3>
              <a href="#" class="search__drop__flag flag">
                <div class="flag__img"> <img src="https://s3.amazonaws.com/uifaces/faces/twitter/pixeliris/128.jpg" alt="User name" class="avatar avatar--small"> </div>
                <div class="flag__body">
                  <h6 class="search__flag__title">Sarah Davidson, 86% match</h6>
                  <p class="search__flag__desc">Female / Age 25 / 2 miles / 2 mutual friends</p>
                </div>
              </a>
              <a href="#" class="search__drop__flag flag">
                <div class="flag__img"> <img src="https://s3.amazonaws.com/uifaces/faces/twitter/pixeliris/128.jpg" alt="User name" class="avatar avatar--small"> </div>
                <div class="flag__body">
                  <h6 class="search__flag__title">Sarah Davidson, 86% match</h6>
                  <p class="search__flag__desc">Female / Age 25 / 2 miles / 2 mutual friends</p>
                </div>
              </a> <a href="" class="search__show-all">Show All <span>(32)</span></a>
              <h3 class="search__drop__title">Events</h3>
              <a href="" class="search__drop__flag flag">
                <div class="flag__img"> <img src="https://s3.amazonaws.com/uifaces/faces/twitter/mutlu82/128.jpg" alt="User name" class="avatar avatar--small"> </div>
                <div class="flag__body">
                  <h6 class="search__flag__title">Snach speed ladder</h6>
                  <p class="search__flag__desc">Portland OR / Tue 33 Jul</p>
                </div>
              </a>
              <a href="" class="search__drop__flag flag">
                <div class="flag__img"> <img src="https://s3.amazonaws.com/uifaces/faces/twitter/mutlu82/128.jpg" alt="User name" class="avatar avatar--small"> </div>
                <div class="flag__body">
                  <h6 class="search__flag__title">Snach speed ladder</h6>
                  <p class="search__flag__desc">Portland OR / Tue 33 Jul</p>
                </div>
              </a> <a href="" class="search__show-all">Show All <span>(32)</span></a> </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tableize__cell has-filter-toggle">
      <div class="tableize__content">
        <a href="" class="btn btn--icon filter-toggle js-filter-toggle">
          <svg role="img" class="icon icon--large">
            <use xlink:href="/static/persiceApp/src/public/icons/icons.svg#icon-messages"></use>
          </svg>
        </a>
      </div>
    </div>
    <div class="tableize__cell">
      <div class="tableize__content">
        <div class="profile-drop">
          <div class="profile-drop__avatar"> <img src="/static/persiceApp/src/public/images/avatar.jpg" alt="User profile"> </div>
          <div class="profile-drop__arrow">
            <svg role="img" class="icon icon--large">
              <use xlink:href="/static/persiceApp/src/public/icons/icons.svg#icon-arrow_down"></use>
            </svg>
          </div>
          <div class="profile-drop__expand">
            <ul class="list-bare">
              <li><a href="#">My profile</a></li>
              <li><a href="#">Settings</a></li>
              <li><a href="#">Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  </header>
 `
})
class TopHeader {
  constructor() {

  }
}

@Component({
  selector: 'crowd-page'
})
@View({
  template: `
  <div class="layout layout--flush content">
  <div class="layout__item 1/1 extralarge-and-up-3/4">
    <div class="listed-users p">
      <div class="layout">
        <div class="layout__item 1/1 medium-and-up-1/2 extralarge-and-up-1/3">
          <div class="card card--user">
            <h4 class="card-title">Jenny Maxton</h4>
            <p class="card-subtitle mb">female / age 25 / 2 miles</p>
            <div class="avatar-box mb"> <img src="https://s3.amazonaws.com/uifaces/faces/twitter/pixeliris/128.jpg" alt="User name" class="avatar">
              <div class="match-percent"></div>
            </div>
            <h6 class="card-subtitle">Shared Interest</h6>
            <ul class="interest-list">
              <li>Dance</li>
              <li>3D printing</li>
              <li>Coking</li>
            </ul>
          </div>
        </div>
        <div class="layout__item 1/1 medium-and-up-1/2 extralarge-and-up-1/3">
          <div class="card card--user">
            <h4 class="card-title">Jenny Maxton</h4>
            <p class="card-subtitle mb">female / age 25 / 2 miles</p>
            <div class="avatar-box mb"> <img src="https://s3.amazonaws.com/uifaces/faces/twitter/pixeliris/128.jpg" alt="User name" class="avatar">
              <div class="match-percent"></div>
            </div>
            <h6 class="card-subtitle">Shared Interest</h6>
            <ul class="interest-list">
              <li>Dance</li>
              <li>3D printing</li>
              <li>Coking</li>
            </ul>
          </div>
        </div>
        <div class="layout__item 1/1 medium-and-up-1/2 extralarge-and-up-1/3">
          <div class="card card--user">
            <h4 class="card-title">Jenny Maxton</h4>
            <p class="card-subtitle mb">female / age 25 / 2 miles</p>
            <div class="avatar-box mb"> <img src="https://s3.amazonaws.com/uifaces/faces/twitter/pixeliris/128.jpg" alt="User name" class="avatar">
              <div class="match-percent"></div>
            </div>
            <h6 class="card-subtitle">Shared Interest</h6>
            <ul class="interest-list">
              <li>Dance</li>
              <li>3D printing</li>
              <li>Coking</li>
            </ul>
          </div>
        </div>
        <div class="layout__item 1/1 medium-and-up-1/2 extralarge-and-up-1/3">
          <div class="card card--user">
            <h4 class="card-title">Jenny Maxton</h4>
            <p class="card-subtitle mb">female / age 25 / 2 miles</p>
            <div class="avatar-box mb"> <img src="https://s3.amazonaws.com/uifaces/faces/twitter/pixeliris/128.jpg" alt="User name" class="avatar">
              <div class="match-percent"></div>
            </div>
            <h6 class="card-subtitle">Shared Interest</h6>
            <ul class="interest-list">
              <li>Dance</li>
              <li>3D printing</li>
              <li>Coking</li>
            </ul>
          </div>
        </div>
        <div class="layout__item 1/1 medium-and-up-1/2 extralarge-and-up-1/3">
          <div class="card card--user">
            <h4 class="card-title">Jenny Maxton</h4>
            <p class="card-subtitle mb">female / age 25 / 2 miles</p>
            <div class="avatar-box mb"> <img src="https://s3.amazonaws.com/uifaces/faces/twitter/pixeliris/128.jpg" alt="User name" class="avatar">
              <div class="match-percent"></div>
            </div>
            <h6 class="card-subtitle">Shared Interest</h6>
            <ul class="interest-list">
              <li>Dance</li>
              <li>3D printing</li>
              <li>Coking</li>
            </ul>
          </div>
        </div>
        <div class="layout__item 1/1 medium-and-up-1/2 extralarge-and-up-1/3">
          <div class="card card--user">
            <h4 class="card-title">Jenny Maxton</h4>
            <p class="card-subtitle mb">female / age 25 / 2 miles</p>
            <div class="avatar-box mb"> <img src="https://s3.amazonaws.com/uifaces/faces/twitter/pixeliris/128.jpg" alt="User name" class="avatar">
              <div class="match-percent"></div>
            </div>
            <h6 class="card-subtitle">Shared Interest</h6>
            <ul class="interest-list">
              <li>Dance</li>
              <li>3D printing</li>
              <li>Coking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="layout__item extralarge-and-up-1/4 filter-place">
    <div class="filter">
      <div class="filter__items">
        <div class="filter__item">
          <h3 class="filter__item__title mb">Gender</h3>
          <label class="c-radio">
            <input class="c-radio__input" type="radio" name="radio" value="All" checked> <span class="c-radio__trigger"></span> <span class="c-radio__label">All</span> </label>
          <label class="c-radio">
            <input class="c-radio__input" type="radio" name="radio" value="Male"> <span class="c-radio__trigger"></span> <span class="c-radio__label">Male</span> </label>
          <label class="c-radio">
            <input class="c-radio__input" type="radio" name="radio" value="Female"> <span class="c-radio__trigger"></span> <span class="c-radio__label">Female</span> </label>
        </div>
        <div class="filter__item">
          <div class="layout layout--middle">
            <div class="layout__item 1/2">
              <h3 class="filter__item__title">Age</h3> </div>
            <div class="layout__item 1/2 text-right"> <span class="range-value">25 - 60</span> </div>
          </div>
          <input type="text" value="" name="range" class="range"> </div>
        <div class="filter__item">
          <div class="layout layout--middle">
            <div class="layout__item 1/2">
              <h3 class="filter__item__title">Distance</h3> </div>
            <div class="layout__item 1/2 text-right"> <span class="range-value">500 miles</span> </div>
          </div>
          <input type="text" class="range-to" value="" name="range"> </div>
        <div class="filter__item">
          <h3 class="filter__item__title mb">Order by</h3>
          <select>
            <option value="match-score">Match Score</option>
            <option value="distance">Distance</option>
            <option value="mutual-friends">Mutual Friends</option>
          </select>
        </div>
        <div class="filter__item">
          <h3 class="filter__item__title mb">Keywords</h3>
          <input type="text" class="c-input" placeholder="Example: Movies, nightlife...">
          <div class="keywords"> <span class="keyword">
                          <a href="">
                            <svg role="img" class="icon icon--small">
                              <use xlink:href="/static/persiceApp/src/public/icons/icons.svg#icon-close"></use>
                            </svg>
                          </a>Dance
                        </span> <span class="keyword">
                        <a href="">
                          <svg role="img" class="icon icon--small">
                            <use xlink:href="/static/persiceApp/src/public/icons/icons.svg#icon-close"></use>
                          </svg>
                        </a>Nightlife
                      </span> <span class="keyword">
                      <a href="">
                        <svg role="img" class="icon icon--small">
                          <use xlink:href="/static/persiceApp/src/public/icons/icons.svg#icon-close"></use>
                        </svg>
                      </a>books
                    </span> <span class="keyword">
                    <a href="">
                      <svg role="img" class="icon icon--small">
                        <use xlink:href="/static/persiceApp/src/public/icons/icons.svg#icon-close"></use>
                      </svg>
                    </a>Technology
                  </span> <span class="keyword">
                  <a href="">
                    <svg role="img" class="icon icon--small">
                      <use xlink:href="/static/persiceApp/src/public/icons/icons.svg#icon-close"></use>
                    </svg>
                  </a>Crossfit
                </span> </div>
        </div>
      </div>
      <footer class="filter__footer">
        <div class="layout layout--small">
          <div class="layout__item 3/5"> <a class="btn btn-1 btn-1--small btn-1--filled btn-1--blue btn--full" href="#">Filter</a> </div>
          <div class="layout__item 2/5"> <a class="btn btn-1 btn-1--small btn-1--darkblue btn--full" href="#">Reset</a> </div>
        </div>
      </footer>
    </div>
  </div>
</div>

  `
})
class CrowdPage {
  constructor() {

  }
}

@Component({
  selector: 'persice-app',
  viewBindings: [HTTP_BINDINGS]
})
@View({
  directives: [LeftNav, TopHeader, CrowdPage],
  template: `
  <div class="tableize tableize--full">
  <div class="tableize__cell">
    <left-nav></left-nav>
  </div>
  <div class="tableize__cell tableize__cell--fill page-content">
      <div class="tableize__content">
      <top-header></top-header>
      <crowd-page></crowd-page>
      </div>
  </div>

  </div>
  `
})
class PersiceApp {
  user: AuthUser;
  data: Object;
  constructor(public http: Http) {
    this.getAuthUser();
  }

  getAuthUser(): void {

    this.http.get('/api/v1/auth/user/?format=json')
      .toRx()
      .map(res => res.json())
      .subscribe(data => console.log(data));

  }
}


bootstrap(PersiceApp)