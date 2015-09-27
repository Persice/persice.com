/// <reference path="../typings/angular2/angular2.d.ts" />
/// <reference path="../typings/angular2/http.d.ts" />
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var angular2_1 = require('angular2/angular2');
var http_1 = require("angular2/http");
var AuthUser = (function () {
    function AuthUser(first_name, last_name, image_url, facebook_id, id) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.image_url = image_url;
        this.facebook_id = facebook_id;
    }
    return AuthUser;
})();
exports.AuthUser = AuthUser;
var LeftNav = (function () {
    function LeftNav() {
    }
    LeftNav = __decorate([
        angular2_1.Component({
            selector: 'left-nav'
        }),
        angular2_1.View({
            template: "\n  <header class=\"tableize__content header-main\">\n  <a class=\"site-logo \" href=\"Persice\"> <img alt=\"#\" src=\"/static/persiceApp/src/public/images/logo.svg\" class=\"site-logo__mark\">\n    <h1 class=\"site-logo__type\">Persice</h1> </a>\n  <nav class=\"nav-main\">\n    <ul>\n      <li class=\"is-current\">\n        <a href=\"#\">\n          <svg role=\"img\" class=\"icon icon--large\">\n            <use xlink:href=\"/static/persiceApp/src/public/icons/icons.svg#icon-crowd\"></use>\n          </svg> <span>Crowd</span></a>\n      </li>\n      <li>\n        <a href=\"#\">\n          <svg role=\"img\" class=\"icon icon--large\">\n            <use xlink:href=\"/static/persiceApp/src/public/icons/icons.svg#icon-messages\"></use>\n          </svg> <span>Message</span></a>\n      </li>\n      <li>\n        <a href=\"#\">\n          <svg role=\"img\" class=\"icon icon--large\">\n            <use xlink:href=\"/static/persiceApp/src/public/icons/icons.svg#icon-connections\"></use>\n          </svg> <span>Connection</span></a>\n      </li>\n      <li>\n        <a href=\"#\">\n          <svg role=\"img\" class=\"icon icon--large\">\n            <use xlink:href=\"/static/persiceApp/src/public/icons/icons.svg#icon-events\"></use>\n          </svg> <span>Events</span></a>\n      </li>\n    </ul>\n  </nav>\n  </header>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], LeftNav);
    return LeftNav;
})();
var TopHeader = (function () {
    function TopHeader() {
    }
    TopHeader = __decorate([
        angular2_1.Component({
            selector: 'top-header'
        }),
        angular2_1.View({
            template: "\n  <header class=\"header-sub\">\n  <div class=\"tableize\">\n    <div class=\"tableize__cell tableize__cell--fill\">\n      <div class=\"tableize__content\">\n        <div class=\"search search--spaced\">\n          <div class=\"search__top\">\n            <svg role=\"img\" class=\"icon icon--large\">\n              <use xlink:href=\"/static/persiceApp/src/public/icons/icons.svg#icon-search\"></use>\n            </svg>\n            <input type=\"text\" class=\"search__input\" placeholder=\"Search\"> </div>\n          <div class=\"has-search__drop\">\n            <div class=\"search__drop\">\n              <h3 class=\"search__drop__title\">Users</h3>\n              <a href=\"#\" class=\"search__drop__flag flag\">\n                <div class=\"flag__img\"> <img src=\"https://s3.amazonaws.com/uifaces/faces/twitter/pixeliris/128.jpg\" alt=\"User name\" class=\"avatar avatar--small\"> </div>\n                <div class=\"flag__body\">\n                  <h6 class=\"search__flag__title\">Sarah Davidson, 86% match</h6>\n                  <p class=\"search__flag__desc\">Female / Age 25 / 2 miles / 2 mutual friends</p>\n                </div>\n              </a>\n              <a href=\"#\" class=\"search__drop__flag flag\">\n                <div class=\"flag__img\"> <img src=\"https://s3.amazonaws.com/uifaces/faces/twitter/pixeliris/128.jpg\" alt=\"User name\" class=\"avatar avatar--small\"> </div>\n                <div class=\"flag__body\">\n                  <h6 class=\"search__flag__title\">Sarah Davidson, 86% match</h6>\n                  <p class=\"search__flag__desc\">Female / Age 25 / 2 miles / 2 mutual friends</p>\n                </div>\n              </a> <a href=\"\" class=\"search__show-all\">Show All <span>(32)</span></a>\n              <h3 class=\"search__drop__title\">Events</h3>\n              <a href=\"\" class=\"search__drop__flag flag\">\n                <div class=\"flag__img\"> <img src=\"https://s3.amazonaws.com/uifaces/faces/twitter/mutlu82/128.jpg\" alt=\"User name\" class=\"avatar avatar--small\"> </div>\n                <div class=\"flag__body\">\n                  <h6 class=\"search__flag__title\">Snach speed ladder</h6>\n                  <p class=\"search__flag__desc\">Portland OR / Tue 33 Jul</p>\n                </div>\n              </a>\n              <a href=\"\" class=\"search__drop__flag flag\">\n                <div class=\"flag__img\"> <img src=\"https://s3.amazonaws.com/uifaces/faces/twitter/mutlu82/128.jpg\" alt=\"User name\" class=\"avatar avatar--small\"> </div>\n                <div class=\"flag__body\">\n                  <h6 class=\"search__flag__title\">Snach speed ladder</h6>\n                  <p class=\"search__flag__desc\">Portland OR / Tue 33 Jul</p>\n                </div>\n              </a> <a href=\"\" class=\"search__show-all\">Show All <span>(32)</span></a> </div>\n          </div>\n        </div>\n      </div>\n    </div>\n    <div class=\"tableize__cell has-filter-toggle\">\n      <div class=\"tableize__content\">\n        <a href=\"\" class=\"btn btn--icon filter-toggle js-filter-toggle\">\n          <svg role=\"img\" class=\"icon icon--large\">\n            <use xlink:href=\"/static/persiceApp/src/public/icons/icons.svg#icon-messages\"></use>\n          </svg>\n        </a>\n      </div>\n    </div>\n    <div class=\"tableize__cell\">\n      <div class=\"tableize__content\">\n        <div class=\"profile-drop\">\n          <div class=\"profile-drop__avatar\"> <img src=\"/static/persiceApp/src/public/images/avatar.jpg\" alt=\"User profile\"> </div>\n          <div class=\"profile-drop__arrow\">\n            <svg role=\"img\" class=\"icon icon--large\">\n              <use xlink:href=\"/static/persiceApp/src/public/icons/icons.svg#icon-arrow_down\"></use>\n            </svg>\n          </div>\n          <div class=\"profile-drop__expand\">\n            <ul class=\"list-bare\">\n              <li><a href=\"#\">My profile</a></li>\n              <li><a href=\"#\">Settings</a></li>\n              <li><a href=\"#\">Logout</a></li>\n            </ul>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n  </header>\n "
        }), 
        __metadata('design:paramtypes', [])
    ], TopHeader);
    return TopHeader;
})();
var CrowdPage = (function () {
    function CrowdPage() {
    }
    CrowdPage = __decorate([
        angular2_1.Component({
            selector: 'crowd-page'
        }),
        angular2_1.View({
            template: "\n  <div class=\"layout layout--flush content\">\n  <div class=\"layout__item 1/1 extralarge-and-up-3/4\">\n    <div class=\"listed-users p\">\n      <div class=\"layout\">\n        <div class=\"layout__item 1/1 medium-and-up-1/2 extralarge-and-up-1/3\">\n          <div class=\"card card--user\">\n            <h4 class=\"card-title\">Jenny Maxton</h4>\n            <p class=\"card-subtitle mb\">female / age 25 / 2 miles</p>\n            <div class=\"avatar-box mb\"> <img src=\"https://s3.amazonaws.com/uifaces/faces/twitter/pixeliris/128.jpg\" alt=\"User name\" class=\"avatar\">\n              <div class=\"match-percent\"></div>\n            </div>\n            <h6 class=\"card-subtitle\">Shared Interest</h6>\n            <ul class=\"interest-list\">\n              <li>Dance</li>\n              <li>3D printing</li>\n              <li>Coking</li>\n            </ul>\n          </div>\n        </div>\n        <div class=\"layout__item 1/1 medium-and-up-1/2 extralarge-and-up-1/3\">\n          <div class=\"card card--user\">\n            <h4 class=\"card-title\">Jenny Maxton</h4>\n            <p class=\"card-subtitle mb\">female / age 25 / 2 miles</p>\n            <div class=\"avatar-box mb\"> <img src=\"https://s3.amazonaws.com/uifaces/faces/twitter/pixeliris/128.jpg\" alt=\"User name\" class=\"avatar\">\n              <div class=\"match-percent\"></div>\n            </div>\n            <h6 class=\"card-subtitle\">Shared Interest</h6>\n            <ul class=\"interest-list\">\n              <li>Dance</li>\n              <li>3D printing</li>\n              <li>Coking</li>\n            </ul>\n          </div>\n        </div>\n        <div class=\"layout__item 1/1 medium-and-up-1/2 extralarge-and-up-1/3\">\n          <div class=\"card card--user\">\n            <h4 class=\"card-title\">Jenny Maxton</h4>\n            <p class=\"card-subtitle mb\">female / age 25 / 2 miles</p>\n            <div class=\"avatar-box mb\"> <img src=\"https://s3.amazonaws.com/uifaces/faces/twitter/pixeliris/128.jpg\" alt=\"User name\" class=\"avatar\">\n              <div class=\"match-percent\"></div>\n            </div>\n            <h6 class=\"card-subtitle\">Shared Interest</h6>\n            <ul class=\"interest-list\">\n              <li>Dance</li>\n              <li>3D printing</li>\n              <li>Coking</li>\n            </ul>\n          </div>\n        </div>\n        <div class=\"layout__item 1/1 medium-and-up-1/2 extralarge-and-up-1/3\">\n          <div class=\"card card--user\">\n            <h4 class=\"card-title\">Jenny Maxton</h4>\n            <p class=\"card-subtitle mb\">female / age 25 / 2 miles</p>\n            <div class=\"avatar-box mb\"> <img src=\"https://s3.amazonaws.com/uifaces/faces/twitter/pixeliris/128.jpg\" alt=\"User name\" class=\"avatar\">\n              <div class=\"match-percent\"></div>\n            </div>\n            <h6 class=\"card-subtitle\">Shared Interest</h6>\n            <ul class=\"interest-list\">\n              <li>Dance</li>\n              <li>3D printing</li>\n              <li>Coking</li>\n            </ul>\n          </div>\n        </div>\n        <div class=\"layout__item 1/1 medium-and-up-1/2 extralarge-and-up-1/3\">\n          <div class=\"card card--user\">\n            <h4 class=\"card-title\">Jenny Maxton</h4>\n            <p class=\"card-subtitle mb\">female / age 25 / 2 miles</p>\n            <div class=\"avatar-box mb\"> <img src=\"https://s3.amazonaws.com/uifaces/faces/twitter/pixeliris/128.jpg\" alt=\"User name\" class=\"avatar\">\n              <div class=\"match-percent\"></div>\n            </div>\n            <h6 class=\"card-subtitle\">Shared Interest</h6>\n            <ul class=\"interest-list\">\n              <li>Dance</li>\n              <li>3D printing</li>\n              <li>Coking</li>\n            </ul>\n          </div>\n        </div>\n        <div class=\"layout__item 1/1 medium-and-up-1/2 extralarge-and-up-1/3\">\n          <div class=\"card card--user\">\n            <h4 class=\"card-title\">Jenny Maxton</h4>\n            <p class=\"card-subtitle mb\">female / age 25 / 2 miles</p>\n            <div class=\"avatar-box mb\"> <img src=\"https://s3.amazonaws.com/uifaces/faces/twitter/pixeliris/128.jpg\" alt=\"User name\" class=\"avatar\">\n              <div class=\"match-percent\"></div>\n            </div>\n            <h6 class=\"card-subtitle\">Shared Interest</h6>\n            <ul class=\"interest-list\">\n              <li>Dance</li>\n              <li>3D printing</li>\n              <li>Coking</li>\n            </ul>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class=\"layout__item extralarge-and-up-1/4 filter-place\">\n    <div class=\"filter\">\n      <div class=\"filter__items\">\n        <div class=\"filter__item\">\n          <h3 class=\"filter__item__title mb\">Gender</h3>\n          <label class=\"c-radio\">\n            <input class=\"c-radio__input\" type=\"radio\" name=\"radio\" value=\"All\" checked> <span class=\"c-radio__trigger\"></span> <span class=\"c-radio__label\">All</span> </label>\n          <label class=\"c-radio\">\n            <input class=\"c-radio__input\" type=\"radio\" name=\"radio\" value=\"Male\"> <span class=\"c-radio__trigger\"></span> <span class=\"c-radio__label\">Male</span> </label>\n          <label class=\"c-radio\">\n            <input class=\"c-radio__input\" type=\"radio\" name=\"radio\" value=\"Female\"> <span class=\"c-radio__trigger\"></span> <span class=\"c-radio__label\">Female</span> </label>\n        </div>\n        <div class=\"filter__item\">\n          <div class=\"layout layout--middle\">\n            <div class=\"layout__item 1/2\">\n              <h3 class=\"filter__item__title\">Age</h3> </div>\n            <div class=\"layout__item 1/2 text-right\"> <span class=\"range-value\">25 - 60</span> </div>\n          </div>\n          <input type=\"text\" value=\"\" name=\"range\" class=\"range\"> </div>\n        <div class=\"filter__item\">\n          <div class=\"layout layout--middle\">\n            <div class=\"layout__item 1/2\">\n              <h3 class=\"filter__item__title\">Distance</h3> </div>\n            <div class=\"layout__item 1/2 text-right\"> <span class=\"range-value\">500 miles</span> </div>\n          </div>\n          <input type=\"text\" class=\"range-to\" value=\"\" name=\"range\"> </div>\n        <div class=\"filter__item\">\n          <h3 class=\"filter__item__title mb\">Order by</h3>\n          <select>\n            <option value=\"match-score\">Match Score</option>\n            <option value=\"distance\">Distance</option>\n            <option value=\"mutual-friends\">Mutual Friends</option>\n          </select>\n        </div>\n        <div class=\"filter__item\">\n          <h3 class=\"filter__item__title mb\">Keywords</h3>\n          <input type=\"text\" class=\"c-input\" placeholder=\"Example: Movies, nightlife...\">\n          <div class=\"keywords\"> <span class=\"keyword\">\n                          <a href=\"\">\n                            <svg role=\"img\" class=\"icon icon--small\">\n                              <use xlink:href=\"/static/persiceApp/src/public/icons/icons.svg#icon-close\"></use>\n                            </svg>\n                          </a>Dance\n                        </span> <span class=\"keyword\">\n                        <a href=\"\">\n                          <svg role=\"img\" class=\"icon icon--small\">\n                            <use xlink:href=\"/static/persiceApp/src/public/icons/icons.svg#icon-close\"></use>\n                          </svg>\n                        </a>Nightlife\n                      </span> <span class=\"keyword\">\n                      <a href=\"\">\n                        <svg role=\"img\" class=\"icon icon--small\">\n                          <use xlink:href=\"/static/persiceApp/src/public/icons/icons.svg#icon-close\"></use>\n                        </svg>\n                      </a>books\n                    </span> <span class=\"keyword\">\n                    <a href=\"\">\n                      <svg role=\"img\" class=\"icon icon--small\">\n                        <use xlink:href=\"/static/persiceApp/src/public/icons/icons.svg#icon-close\"></use>\n                      </svg>\n                    </a>Technology\n                  </span> <span class=\"keyword\">\n                  <a href=\"\">\n                    <svg role=\"img\" class=\"icon icon--small\">\n                      <use xlink:href=\"/static/persiceApp/src/public/icons/icons.svg#icon-close\"></use>\n                    </svg>\n                  </a>Crossfit\n                </span> </div>\n        </div>\n      </div>\n      <footer class=\"filter__footer\">\n        <div class=\"layout layout--small\">\n          <div class=\"layout__item 3/5\"> <a class=\"btn btn-1 btn-1--small btn-1--filled btn-1--blue btn--full\" href=\"#\">Filter</a> </div>\n          <div class=\"layout__item 2/5\"> <a class=\"btn btn-1 btn-1--small btn-1--darkblue btn--full\" href=\"#\">Reset</a> </div>\n        </div>\n      </footer>\n    </div>\n  </div>\n</div>\n\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], CrowdPage);
    return CrowdPage;
})();
var PersiceApp = (function () {
    function PersiceApp(http) {
        this.http = http;
        this.getAuthUser();
    }
    PersiceApp.prototype.getAuthUser = function () {
        this.http.get('/api/v1/auth/user/?format=json')
            .toRx()
            .map(function (res) { return res.json(); })
            .subscribe(function (data) { return console.log(data); });
    };
    PersiceApp = __decorate([
        angular2_1.Component({
            selector: 'persice-app',
            viewBindings: [http_1.HTTP_BINDINGS]
        }),
        angular2_1.View({
            directives: [LeftNav, TopHeader, CrowdPage],
            template: "\n  <div class=\"tableize tableize--full\">\n  <div class=\"tableize__cell\">\n    <left-nav></left-nav>\n  </div>\n  <div class=\"tableize__cell tableize__cell--fill page-content\">\n      <div class=\"tableize__content\">\n      <top-header></top-header>\n      <crowd-page></crowd-page>\n      </div>\n  </div>\n\n  </div>\n  "
        }), 
        __metadata('design:paramtypes', [http_1.Http])
    ], PersiceApp);
    return PersiceApp;
})();
angular2_1.bootstrap(PersiceApp);
