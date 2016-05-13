webpackJsonp([3],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/*
	 * Providers provided by Angular
	 */
	var platform_browser_dynamic_1 = __webpack_require__(124);
	/*
	* Platform and Environment
	* our providers/directives/pipes
	*/
	var browser_1 = __webpack_require__(182);
	var environment_1 = __webpack_require__(183);
	/*
	* App Component
	* our top level component that holds all of our components
	*/
	var app_mobile_1 = __webpack_require__(727);
	/*
	 * Bootstrap our Angular app with a top level component `App` and inject
	 * our Services and Providers into Angular's dependency injection
	 */
	function main(initialHmrState) {
	    return platform_browser_dynamic_1.bootstrap(app_mobile_1.AppMobileComponent, environment_1.ENV_PROVIDERS.concat(browser_1.PROVIDERS_MAIN, browser_1.DIRECTIVES, browser_1.PIPES, app_mobile_1.APP_PROVIDERS))
	        .catch(function (err) { return console.error(err); });
	}
	exports.main = main;
	/*
	 * Vendors
	 * For vendors for example jQuery, Lodash, angular2-jwt just import them anywhere in your app
	 * You can also import them in vendors to ensure that they are bundled in one file
	 * Also see custom-typings.d.ts as you also need to do `typings install x` where `x` is your module
	 */
	/*
	 * Hot Module Reload
	 * experimental version
	 */
	if (false) {
	    // activate hot module reload
	    var ngHmr = require('angular2-hmr');
	    ngHmr.hotModuleReplacement(main, module);
	}
	else {
	    // bootstrap when documetn is ready
	    document.addEventListener('DOMContentLoaded', function () { return main(); });
	}


/***/ },

/***/ 13:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(176));
	__export(__webpack_require__(278));
	__export(__webpack_require__(279));
	__export(__webpack_require__(177));
	__export(__webpack_require__(280));
	__export(__webpack_require__(281));
	__export(__webpack_require__(282));
	__export(__webpack_require__(283));
	__export(__webpack_require__(284));


/***/ },

/***/ 50:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var MapsAPILoader = (function () {
	    function MapsAPILoader() {
	    }
	    MapsAPILoader = __decorate([
	        core_1.Injectable(), 
	        __metadata('design:paramtypes', [])
	    ], MapsAPILoader);
	    return MapsAPILoader;
	}());
	exports.MapsAPILoader = MapsAPILoader;


/***/ },

/***/ 92:
/***/ function(module, exports) {

	"use strict";
	var SocialNetwork = (function () {
	    function SocialNetwork() {
	    }
	    Object.defineProperty(SocialNetwork.prototype, "name", {
	        get: function () {
	            return this._name;
	        },
	        set: function (value) {
	            this._name = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SocialNetwork.prototype, "url", {
	        get: function () {
	            return this._url;
	        },
	        set: function (value) {
	            this._url = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return SocialNetwork;
	}());
	exports.SocialNetwork = SocialNetwork;


/***/ },

/***/ 107:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var util_1 = __webpack_require__(80);
	var social_network_facebook_1 = __webpack_require__(261);
	var social_network_linkedin_1 = __webpack_require__(262);
	var social_network_twitter_1 = __webpack_require__(263);
	var Person = (function () {
	    function Person(dto) {
	        this._id = dto.id;
	        this._firstName = dto.first_name;
	        this._lastName = dto.last_name;
	        this._gender = Person.parseGender(dto.gender);
	        this._age = dto.age;
	        this._distance = dto.distance[0];
	        this._distanceUnit = dto.distance[1];
	        this._image = dto.image;
	        this._score = dto.score;
	        this._about = dto.about ? dto.about : '';
	        this._livesIn = dto.lives_in ? dto.lives_in : '';
	        this._job = dto.position && dto.position.job ? dto.position.job : '';
	        this._company = dto.position && dto.position.company ? dto.position.company : '';
	        var topInterestsFromDto = util_1.ObjectUtil.firstSorted(dto.top_interests[0], 6);
	        var halfLength = Math.ceil(topInterestsFromDto.length / 2);
	        this._topInterests = util_1.ObjectUtil.firstSorted(dto.top_interests[0], 6);
	        this.topInterestsFirstHalf = topInterestsFromDto.splice(0, halfLength);
	        this.topInterestsSecondHalf = topInterestsFromDto;
	        var goalsFromDto = util_1.ObjectUtil.transformSorted(dto.goals[0]), offersFromDto = util_1.ObjectUtil.transformSorted(dto.offers[0]), interestsFromDto = util_1.ObjectUtil.transformSorted(dto.interests[0]), likesFromDto = dto.likes, likesMutualCountFromDto = util_1.ListUtil.filterAndCount(dto.likes, 'match', 1);
	        this._goals = goalsFromDto;
	        this._goalsCount = goalsFromDto.length;
	        this._offers = offersFromDto;
	        this._offersCount = offersFromDto.length;
	        this._interests = interestsFromDto;
	        this._interestsCount = interestsFromDto.length;
	        this._likes = likesFromDto;
	        this._likesCount = likesFromDto.length;
	        this._likesMutualCount = likesMutualCountFromDto;
	        this._facebook = new social_network_facebook_1.SocialNetworkFacebook(dto.facebook_id);
	        this._twitter = new social_network_twitter_1.SocialNetworkTwitter(dto.twitter_username);
	        this._linkedin = new social_network_linkedin_1.SocialNetworkLinkedin(dto.linkedin_provider);
	    }
	    Person.parseGender = function (value) {
	        var retValue = '';
	        switch (value) {
	            case 'm':
	                retValue = 'Male';
	                break;
	            case 'f':
	                retValue = 'Female';
	                break;
	            default:
	                retValue = '';
	                break;
	        }
	        return retValue;
	    };
	    Object.defineProperty(Person.prototype, "id", {
	        get: function () {
	            return this._id;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Person.prototype, "firstName", {
	        get: function () {
	            return this._firstName;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Person.prototype, "lastName", {
	        get: function () {
	            return this._lastName;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Person.prototype, "gender", {
	        get: function () {
	            return this._gender;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Person.prototype, "age", {
	        get: function () {
	            return this._age;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Person.prototype, "distance", {
	        get: function () {
	            return this._distance;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Person.prototype, "distanceUnit", {
	        get: function () {
	            return this._distanceUnit;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Person.prototype, "topInterests", {
	        get: function () {
	            return this._topInterests;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Person.prototype, "image", {
	        get: function () {
	            return this._image;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Person.prototype, "score", {
	        get: function () {
	            return this._score;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Person.prototype, "livesIn", {
	        get: function () {
	            return this._livesIn;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Person.prototype, "about", {
	        get: function () {
	            return this._about;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Person.prototype, "job", {
	        get: function () {
	            return this._job;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Person.prototype, "company", {
	        get: function () {
	            return this._company;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Person.prototype, "facebookUrl", {
	        get: function () {
	            return this._facebook.url;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Person.prototype, "twitterUrl", {
	        get: function () {
	            return this._twitter.url;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Person.prototype, "linkedinUrl", {
	        get: function () {
	            return this._linkedin.url;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Person.prototype, "interests", {
	        get: function () {
	            return this._interests;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Person.prototype, "interestsCount", {
	        get: function () {
	            return this._interestsCount;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Person.prototype, "offers", {
	        get: function () {
	            return this._offers;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Person.prototype, "offersCount", {
	        get: function () {
	            return this._offersCount;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Person.prototype, "goals", {
	        get: function () {
	            return this._goals;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Person.prototype, "goalsCount", {
	        get: function () {
	            return this._goalsCount;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Person.prototype, "likes", {
	        get: function () {
	            return this._likes;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Person.prototype, "likesCount", {
	        get: function () {
	            return this._likesCount;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Person.prototype, "likesMutualCount", {
	        get: function () {
	            return this._likesMutualCount;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return Person;
	}());
	exports.Person = Person;


/***/ },

/***/ 108:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(178));
	__export(__webpack_require__(285));


/***/ },

/***/ 127:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var marker_manager_1 = __webpack_require__(131);
	var markerId = 0;
	/**
	 * GoogleMapMarker renders a map marker inside a {@link GoogleMap}.
	 *
	 * ### Example
	 * ```typescript
	 * import {Component} from '@angular/core';
	 * import {GoogleMap, GoogleMapMarker} from 'angular2-google-maps/core';
	 *
	 * @Component({
	 *  selector: 'my-map-cmp',
	 *  directives: [GoogleMap, GoogleMapMarker],
	 *  styles: [`
	 *    .google-map-container {
	 *      height: 300px;
	 *    }
	 * `],
	 *  template: `
	 *    <google-map [latitude]="lat" [longitude]="lng" [zoom]="zoom">
	 *      <-google-map-marker [latitude]="lat" [longitude]="lng" [label]="'M'">
	 *      </-google-map-marker>
	 *    </google-map>
	 *  `
	 * })
	 * ```
	 */
	var GoogleMapMarker = (function () {
	    function GoogleMapMarker(_markerManager) {
	        this._markerManager = _markerManager;
	        /**
	         * If true, the marker can be dragged. Default value is false.
	         */
	        this.draggable = false;
	        /**
	         * This event emitter gets emitted when the user clicks on the marker.
	         */
	        this.markerClick = new core_1.EventEmitter();
	        /**
	         * This event is fired when the user stops dragging the marker.
	         */
	        this.dragEnd = new core_1.EventEmitter();
	        this._markerAddedToManger = false;
	        this._id = (markerId++).toString();
	    }
	    /** @internal */
	    GoogleMapMarker.prototype.ngOnChanges = function (changes) {
	        if (typeof this.latitude !== 'number' || typeof this.longitude !== 'number') {
	            return;
	        }
	        if (!this._markerAddedToManger) {
	            this._markerManager.addMarker(this);
	            this._markerAddedToManger = true;
	            this._addEventListeners();
	            return;
	        }
	        if (changes['latitude'] || changes['longitude']) {
	            this._markerManager.updateMarkerPosition(this);
	        }
	        if (changes['title']) {
	            this._markerManager.updateTitle(this);
	        }
	        if (changes['label']) {
	            this._markerManager.updateLabel(this);
	        }
	        if (changes['draggable']) {
	            this._markerManager.updateDraggable(this);
	        }
	    };
	    /** @internal */
	    GoogleMapMarker.prototype.id = function () { return this._id; };
	    /** @internal */
	    GoogleMapMarker.prototype.toString = function () { return 'GoogleMapMarker-' + this._id.toString(); };
	    /** @internal */
	    GoogleMapMarker.prototype.ngOnDestroy = function () { this._markerManager.deleteMarker(this); };
	    GoogleMapMarker.prototype._addEventListeners = function () {
	        var _this = this;
	        this._markerManager.createEventObservable('click', this).subscribe(function () {
	            _this.markerClick.next(null);
	        });
	        this._markerManager.createEventObservable('dragend', this)
	            .subscribe(function (e) {
	            _this.dragEnd.next({ coords: { lat: e.latLng.lat(), lng: e.latLng.lng() } });
	        });
	    };
	    __decorate([
	        core_1.Input(), 
	        __metadata('design:type', Number)
	    ], GoogleMapMarker.prototype, "latitude", void 0);
	    __decorate([
	        core_1.Input(), 
	        __metadata('design:type', Number)
	    ], GoogleMapMarker.prototype, "longitude", void 0);
	    __decorate([
	        core_1.Input(), 
	        __metadata('design:type', String)
	    ], GoogleMapMarker.prototype, "title", void 0);
	    __decorate([
	        core_1.Input(), 
	        __metadata('design:type', String)
	    ], GoogleMapMarker.prototype, "label", void 0);
	    __decorate([
	        core_1.Input(), 
	        __metadata('design:type', Boolean)
	    ], GoogleMapMarker.prototype, "draggable", void 0);
	    __decorate([
	        core_1.Output(), 
	        __metadata('design:type', core_1.EventEmitter)
	    ], GoogleMapMarker.prototype, "markerClick", void 0);
	    __decorate([
	        core_1.Output(), 
	        __metadata('design:type', core_1.EventEmitter)
	    ], GoogleMapMarker.prototype, "dragEnd", void 0);
	    GoogleMapMarker = __decorate([
	        core_1.Directive({
	            selector: 'google-map-marker'
	        }), 
	        __metadata('design:paramtypes', [marker_manager_1.MarkerManager])
	    ], GoogleMapMarker);
	    return GoogleMapMarker;
	}());
	exports.GoogleMapMarker = GoogleMapMarker;


/***/ },

/***/ 128:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var google_maps_api_wrapper_1 = __webpack_require__(129);
	var marker_manager_1 = __webpack_require__(131);
	/**
	 * GoogleMap renders a Google Map.
	 * **Important note**: To be able see a map in the browser, you have to define a height for the CSS
	 * class `google-map-container`.
	 *
	 * ### Example
	 * ```typescript
	 * import {Component} from '@angular/core';
	 * import {GoogleMap} from 'angular2google-maps/core';
	 *
	 * @Component({
	 *  selector: 'my-map-cmp',
	 *  directives: [GoogleMap],
	 *  styles: [`
	 *    .google-map-container {
	 *      height: 300px;
	 *    }
	 * `],
	 *  template: `
	 *    <google-map [latitude]="lat" [longitude]="lng" [zoom]="zoom">
	 *    </google-map>
	 *  `
	 * })
	 * ```
	 */
	var GoogleMap = (function () {
	    function GoogleMap(_elem, _mapsWrapper) {
	        this._elem = _elem;
	        this._mapsWrapper = _mapsWrapper;
	        /**
	         * Enables/disables zoom and center on double click. Enabled by default.
	         */
	        this.disableDoubleClickZoom = false;
	        /**
	         * Enables/disables all default UI of the Google map. Please note: When the map is created, this
	         * value cannot get updated.
	         */
	        this.disableDefaultUI = false;
	        /**
	         * This event emitter gets emitted when the user clicks on the map (but not when they click on a
	         * marker or infoWindow).
	         */
	        this.mapClick = new core_1.EventEmitter();
	        /**
	         * This event emitter gets emitted when the user right-clicks on the map (but not when they click
	         * on a marker or infoWindow).
	         */
	        this.mapRightClick = new core_1.EventEmitter();
	        /**
	         * This event emitter gets emitted when the user double-clicks on the map (but not when they click
	         * on a marker or infoWindow).
	         */
	        this.mapDblClick = new core_1.EventEmitter();
	        this._longitude = 0;
	        this._latitude = 0;
	        this._zoom = 8;
	    }
	    GoogleMap._containsMapOptionsChange = function (changesKeys) {
	        return changesKeys.every(function (key) { return GoogleMap._mapOptionsAttributes.indexOf(key) !== 1; });
	    };
	    /** @internal */
	    GoogleMap.prototype.ngOnInit = function () {
	        var container = this._elem.nativeElement.querySelector('.google-map-container');
	        this._initMapInstance(container);
	    };
	    /** @internal */
	    GoogleMap.prototype.ngOnChanges = function (changes) {
	        if (GoogleMap._containsMapOptionsChange(Object.keys(changes))) {
	            this._mapsWrapper.setMapOptions({ disableDoubleClickZoom: this.disableDoubleClickZoom });
	        }
	    };
	    Object.defineProperty(GoogleMap.prototype, "zoom", {
	        /**
	         * Sets the zoom level of the map. The default value is `8`.
	         */
	        set: function (value) {
	            this._zoom = this._convertToDecimal(value, 8);
	            if (typeof this._zoom === 'number') {
	                this._mapsWrapper.setZoom(this._zoom);
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(GoogleMap.prototype, "longitude", {
	        /**
	         * The longitude that sets the center of the map.
	         */
	        set: function (value) {
	            this._longitude = this._convertToDecimal(value);
	            this._updateCenter();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(GoogleMap.prototype, "latitude", {
	        /**
	         * The latitude that sets the center of the map.
	         */
	        set: function (value) {
	            this._latitude = this._convertToDecimal(value);
	            this._updateCenter();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    GoogleMap.prototype._convertToDecimal = function (value, defaultValue) {
	        if (defaultValue === void 0) { defaultValue = null; }
	        if (typeof value === 'string') {
	            return parseFloat(value);
	        }
	        else if (typeof value === 'number') {
	            return value;
	        }
	        return defaultValue;
	    };
	    GoogleMap.prototype._updateCenter = function () {
	        if (typeof this._latitude !== 'number' || typeof this._longitude !== 'number') {
	            return;
	        }
	        this._mapsWrapper.setCenter({
	            lat: this._latitude,
	            lng: this._longitude,
	        });
	    };
	    GoogleMap.prototype._handleMapCenterChange = function () {
	        var _this = this;
	        this._mapsWrapper.subscribeToMapEvent('center_changed').subscribe(function () {
	            _this._mapsWrapper.getCenter().then(function (center) {
	                _this._latitude = center.lat();
	                _this._longitude = center.lng();
	            });
	        });
	    };
	    GoogleMap.prototype._handleMapZoomChange = function () {
	        var _this = this;
	        this._mapsWrapper.subscribeToMapEvent('zoom_changed').subscribe(function () {
	            _this._mapsWrapper.getZoom().then(function (z) { return _this._zoom = z; });
	        });
	    };
	    GoogleMap.prototype._handleMapMouseEvents = function () {
	        var _this = this;
	        var events = [
	            { name: 'click', emitter: this.mapClick }, { name: 'rightclick', emitter: this.mapRightClick },
	            { name: 'dblclick', emitter: this.mapDblClick }
	        ];
	        events.forEach(function (e) {
	            _this._mapsWrapper.subscribeToMapEvent(e.name).subscribe(function (event) {
	                var value = { coords: { lat: event.latLng.lat(), lng: event.latLng.lng() } };
	                e.emitter.emit(value);
	            });
	        });
	    };
	    GoogleMap.prototype._initMapInstance = function (el) {
	        this._mapsWrapper.createMap(el, {
	            center: { lat: this._latitude, lng: this._longitude },
	            zoom: this._zoom,
	            disableDefaultUI: this.disableDefaultUI
	        });
	        this._handleMapCenterChange();
	        this._handleMapZoomChange();
	        this._handleMapMouseEvents();
	    };
	    /**
	     * Map option attributes that can change over time
	     */
	    GoogleMap._mapOptionsAttributes = ['disableDoubleClickZoom'];
	    __decorate([
	        core_1.Input(), 
	        __metadata('design:type', Boolean)
	    ], GoogleMap.prototype, "disableDoubleClickZoom", void 0);
	    __decorate([
	        core_1.Input(), 
	        __metadata('design:type', Boolean)
	    ], GoogleMap.prototype, "disableDefaultUI", void 0);
	    __decorate([
	        core_1.Output(), 
	        __metadata('design:type', core_1.EventEmitter)
	    ], GoogleMap.prototype, "mapClick", void 0);
	    __decorate([
	        core_1.Output(), 
	        __metadata('design:type', core_1.EventEmitter)
	    ], GoogleMap.prototype, "mapRightClick", void 0);
	    __decorate([
	        core_1.Output(), 
	        __metadata('design:type', core_1.EventEmitter)
	    ], GoogleMap.prototype, "mapDblClick", void 0);
	    __decorate([
	        core_1.Input(), 
	        __metadata('design:type', Object), 
	        __metadata('design:paramtypes', [Object])
	    ], GoogleMap.prototype, "zoom", null);
	    __decorate([
	        core_1.Input(), 
	        __metadata('design:type', Object), 
	        __metadata('design:paramtypes', [Object])
	    ], GoogleMap.prototype, "longitude", null);
	    __decorate([
	        core_1.Input(), 
	        __metadata('design:type', Object), 
	        __metadata('design:paramtypes', [Object])
	    ], GoogleMap.prototype, "latitude", null);
	    GoogleMap = __decorate([
	        core_1.Component({
	            selector: 'google-map',
	            providers: [google_maps_api_wrapper_1.GoogleMapsAPIWrapper, marker_manager_1.MarkerManager],
	            template: "\n    <div class=\"google-map-container\"></div>\n    <ng-content></ng-content>\n  "
	        }), 
	        __metadata('design:paramtypes', [core_1.ElementRef, google_maps_api_wrapper_1.GoogleMapsAPIWrapper])
	    ], GoogleMap);
	    return GoogleMap;
	}());
	exports.GoogleMap = GoogleMap;


/***/ },

/***/ 129:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var Observable_1 = __webpack_require__(2);
	var maps_api_loader_1 = __webpack_require__(50);
	/**
	 * Wrapper class that handles the communication with the Google Maps Javascript
	 * API v3
	 */
	var GoogleMapsAPIWrapper = (function () {
	    function GoogleMapsAPIWrapper(_loader, _zone) {
	        var _this = this;
	        this._loader = _loader;
	        this._zone = _zone;
	        this._map =
	            new Promise(function (resolve) { _this._mapResolver = resolve; });
	    }
	    GoogleMapsAPIWrapper.prototype.createMap = function (el, mapOptions) {
	        var _this = this;
	        return this._loader.load().then(function () {
	            var map = new google.maps.Map(el, mapOptions);
	            _this._mapResolver(map);
	            return;
	        });
	    };
	    GoogleMapsAPIWrapper.prototype.setMapOptions = function (options) {
	        this._map.then(function (m) { m.setOptions(options); });
	    };
	    /**
	     * Creates a google map marker with the map context
	     */
	    GoogleMapsAPIWrapper.prototype.createMarker = function (options) {
	        if (options === void 0) { options = {}; }
	        return this._map.then(function (map) {
	            options.map = map;
	            return new google.maps.Marker(options);
	        });
	    };
	    GoogleMapsAPIWrapper.prototype.subscribeToMapEvent = function (eventName) {
	        var _this = this;
	        return Observable_1.Observable.create(function (observer) {
	            _this._map.then(function (m) {
	                m.addListener(eventName, function (arg) { _this._zone.run(function () { return observer.next(arg); }); });
	            });
	        });
	    };
	    GoogleMapsAPIWrapper.prototype.setCenter = function (latLng) {
	        return this._map.then(function (map) { return map.setCenter(latLng); });
	    };
	    GoogleMapsAPIWrapper.prototype.getZoom = function () { return this._map.then(function (map) { return map.getZoom(); }); };
	    GoogleMapsAPIWrapper.prototype.setZoom = function (zoom) {
	        return this._map.then(function (map) { return map.setZoom(zoom); });
	    };
	    GoogleMapsAPIWrapper.prototype.getCenter = function () {
	        return this._map.then(function (map) { return map.getCenter(); });
	    };
	    GoogleMapsAPIWrapper = __decorate([
	        core_1.Injectable(), 
	        __metadata('design:paramtypes', [maps_api_loader_1.MapsAPILoader, core_1.NgZone])
	    ], GoogleMapsAPIWrapper);
	    return GoogleMapsAPIWrapper;
	}());
	exports.GoogleMapsAPIWrapper = GoogleMapsAPIWrapper;


/***/ },

/***/ 130:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var maps_api_loader_1 = __webpack_require__(50);
	(function (GoogleMapsScriptProtocol) {
	    GoogleMapsScriptProtocol[GoogleMapsScriptProtocol["HTTP"] = 0] = "HTTP";
	    GoogleMapsScriptProtocol[GoogleMapsScriptProtocol["HTTPS"] = 1] = "HTTPS";
	    GoogleMapsScriptProtocol[GoogleMapsScriptProtocol["AUTO"] = 2] = "AUTO";
	})(exports.GoogleMapsScriptProtocol || (exports.GoogleMapsScriptProtocol = {}));
	var GoogleMapsScriptProtocol = exports.GoogleMapsScriptProtocol;
	var LazyMapsAPILoaderConfig = (function () {
	    function LazyMapsAPILoaderConfig() {
	        /**
	         * The Google Maps API Key (see:
	         * https://developers.google.com/maps/documentation/javascript/get-api-key)
	         */
	        this.apiKey = null;
	        /**
	         * Google Maps API version.
	         */
	        this.apiVersion = '3';
	        /**
	         * Host and Path used for the `<script>` tag.
	         */
	        this.hostAndPath = 'maps.googleapis.com/maps/api/js';
	        /**
	         * Protocol used for the `<script>` tag.
	         */
	        this.protocol = GoogleMapsScriptProtocol.HTTPS;
	        /**
	         * Defines which Google Maps libraries should get loaded.
	         */
	        this.libraries = ['places'];
	        /**
	         * The default bias for the map behavior is US.
	         * If you wish to alter your application to serve different map tiles or bias the
	         * application, you can overwrite the default behavior (US) by defining a `region`.
	         * See https://developers.google.com/maps/documentation/javascript/basics#Region
	         */
	        this.region = null;
	        /**
	         * The Google Maps API uses the browser's preferred language when displaying
	         * textual information. If you wish to overwrite this behavior and force the API
	         * to use a given language, you can use this setting.
	         * See https://developers.google.com/maps/documentation/javascript/basics#Language
	         */
	        this.language = null;
	    }
	    return LazyMapsAPILoaderConfig;
	}());
	exports.LazyMapsAPILoaderConfig = LazyMapsAPILoaderConfig;
	var DEFAULT_CONFIGURATION = new LazyMapsAPILoaderConfig();
	var LazyMapsAPILoader = (function (_super) {
	    __extends(LazyMapsAPILoader, _super);
	    function LazyMapsAPILoader(_config) {
	        _super.call(this);
	        this._config = _config;
	        if (this._config === null || this._config === undefined) {
	            this._config = DEFAULT_CONFIGURATION;
	        }
	    }
	    LazyMapsAPILoader.prototype.load = function () {
	        if (this._scriptLoadingPromise) {
	            return this._scriptLoadingPromise;
	        }
	        var script = document.createElement('script');
	        script.type = 'text/javascript';
	        script.async = true;
	        script.defer = true;
	        var callbackName = "angular2googlemaps" + new Date().getMilliseconds();
	        script.src = this._getScriptSrc(callbackName);
	        this._scriptLoadingPromise = new Promise(function (resolve, reject) {
	            window[callbackName] = function () { resolve(); };
	            script.onerror = function (error) { reject(error); };
	        });
	        document.body.appendChild(script);
	        return this._scriptLoadingPromise;
	    };
	    LazyMapsAPILoader.prototype._getScriptSrc = function (callbackName) {
	        var protocolType = (this._config && this._config.protocol) || DEFAULT_CONFIGURATION.protocol;
	        var protocol;
	        switch (protocolType) {
	            case GoogleMapsScriptProtocol.AUTO:
	                protocol = '';
	                break;
	            case GoogleMapsScriptProtocol.HTTP:
	                protocol = 'http:';
	                break;
	            case GoogleMapsScriptProtocol.HTTPS:
	                protocol = 'https:';
	                break;
	        }
	        var hostAndPath = this._config.hostAndPath || DEFAULT_CONFIGURATION.hostAndPath;
	        var apiKey = this._config.apiKey || DEFAULT_CONFIGURATION.apiKey;
	        var libraries = this._config.libraries || DEFAULT_CONFIGURATION.libraries;
	        var region = this._config.region || DEFAULT_CONFIGURATION.region;
	        var language = this._config.language || DEFAULT_CONFIGURATION.language;
	        var queryParams = {
	            v: this._config.apiVersion || DEFAULT_CONFIGURATION.apiKey,
	            callback: callbackName
	        };
	        if (apiKey) {
	            queryParams['key'] = apiKey;
	        }
	        if (libraries != null && libraries.length > 0) {
	            queryParams['libraries'] = libraries.join(',');
	        }
	        if (region != null && region.length > 0) {
	            queryParams['region'] = region;
	        }
	        if (language != null && language.length > 0) {
	            queryParams['language'] = language;
	        }
	        var params = Object.keys(queryParams)
	            .map(function (k, i) {
	            var param = (i === 0) ? '?' : '&';
	            return param += k + "=" + queryParams[k];
	        })
	            .join('');
	        return protocol + "//" + hostAndPath + params;
	    };
	    LazyMapsAPILoader = __decorate([
	        core_1.Injectable(),
	        __param(0, core_1.Optional()), 
	        __metadata('design:paramtypes', [LazyMapsAPILoaderConfig])
	    ], LazyMapsAPILoader);
	    return LazyMapsAPILoader;
	}(maps_api_loader_1.MapsAPILoader));
	exports.LazyMapsAPILoader = LazyMapsAPILoader;


/***/ },

/***/ 131:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var Observable_1 = __webpack_require__(2);
	var google_maps_api_wrapper_1 = __webpack_require__(129);
	var MarkerManager = (function () {
	    function MarkerManager(_mapsWrapper, _zone) {
	        this._mapsWrapper = _mapsWrapper;
	        this._zone = _zone;
	        this._markers = new Map();
	    }
	    MarkerManager.prototype.deleteMarker = function (marker) {
	        var _this = this;
	        var m = this._markers.get(marker);
	        if (m == null) {
	            // marker already deleted
	            return Promise.resolve();
	        }
	        return m.then(function (m) {
	            return _this._zone.run(function () {
	                m.setMap(null);
	                _this._markers.delete(marker);
	            });
	        });
	    };
	    MarkerManager.prototype.updateMarkerPosition = function (marker) {
	        return this._markers.get(marker).then(function (m) { return m.setPosition({ lat: marker.latitude, lng: marker.longitude }); });
	    };
	    MarkerManager.prototype.updateTitle = function (marker) {
	        return this._markers.get(marker).then(function (m) { return m.setTitle(marker.title); });
	    };
	    MarkerManager.prototype.updateLabel = function (marker) {
	        return this._markers.get(marker).then(function (m) { m.setLabel(marker.label); });
	    };
	    MarkerManager.prototype.updateDraggable = function (marker) {
	        return this._markers.get(marker).then(function (m) { return m.setDraggable(marker.draggable); });
	    };
	    MarkerManager.prototype.addMarker = function (marker) {
	        var markerPromise = this._mapsWrapper.createMarker({
	            position: { lat: marker.latitude, lng: marker.longitude },
	            label: marker.label,
	            draggable: marker.draggable
	        });
	        this._markers.set(marker, markerPromise);
	    };
	    MarkerManager.prototype.createEventObservable = function (eventName, marker) {
	        var _this = this;
	        return Observable_1.Observable.create(function (observer) {
	            _this._markers.get(marker).then(function (m) {
	                m.addListener(eventName, function (e) { return _this._zone.run(function () { return observer.next(e); }); });
	            });
	        });
	    };
	    MarkerManager = __decorate([
	        core_1.Injectable(), 
	        __metadata('design:paramtypes', [google_maps_api_wrapper_1.GoogleMapsAPIWrapper, core_1.NgZone])
	    ], MarkerManager);
	    return MarkerManager;
	}());
	exports.MarkerManager = MarkerManager;


/***/ },

/***/ 132:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var core_2 = __webpack_require__(5);
	var ConnectionsService = (function () {
	    function ConnectionsService(http) {
	        this.http = http;
	        this.next = '';
	    }
	    ConnectionsService.prototype.get = function (url, limit, filter) {
	        if (url === '') {
	            var params = [
	                "format=json",
	                ("limit=" + limit),
	                ("filter=" + (filter ? filter : true)),
	                "offset=0",
	            ].join('&');
	            this.next = ConnectionsService.API_URL + "?" + params;
	        }
	        else {
	            this.next = url;
	        }
	        return this.http.get(this.next).map(function (res) { return res.json(); });
	    };
	    ConnectionsService.API_URL = '/api/v1/connections/';
	    ConnectionsService = __decorate([
	        core_1.Injectable(), 
	        __metadata('design:paramtypes', [core_2.HttpClient])
	    ], ConnectionsService);
	    return ConnectionsService;
	}());
	exports.ConnectionsService = ConnectionsService;
	exports.connectionsServiceInjectables = [
	    core_1.provide(ConnectionsService, { useClass: ConnectionsService })
	];


/***/ },

/***/ 133:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var http_client_1 = __webpack_require__(277);
	var CrowdService = (function () {
	    function CrowdService(http) {
	        this.http = http;
	        this.next = '';
	    }
	    CrowdService.prototype.get = function (url, limit) {
	        if (url === '') {
	            var params = [
	                "format=json",
	                ("limit=" + limit),
	                "offset=0",
	            ].join('&');
	            this.next = CrowdService.API_URL + "?" + params;
	        }
	        else {
	            this.next = url;
	        }
	        return this.http.get(this.next).map(function (res) { return res.json(); });
	    };
	    CrowdService.API_URL = '/api/v1/matchfeed/';
	    CrowdService = __decorate([
	        core_1.Injectable(), 
	        __metadata('design:paramtypes', [http_client_1.HttpClient])
	    ], CrowdService);
	    return CrowdService;
	}());
	exports.CrowdService = CrowdService;
	exports.crowdServiceInjectables = [
	    core_1.provide(CrowdService, { useClass: CrowdService })
	];


/***/ },

/***/ 134:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(293));


/***/ },

/***/ 135:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(296));


/***/ },

/***/ 168:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(747));


/***/ },

/***/ 175:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	var core_1 = __webpack_require__(1);
	var maps_api_loader_1 = __webpack_require__(50);
	var lazy_maps_api_loader_1 = __webpack_require__(130);
	// main modules
	__export(__webpack_require__(273));
	__export(__webpack_require__(274));
	exports.ANGULAR2_GOOGLE_MAPS_PROVIDERS = [
	    new core_1.Provider(maps_api_loader_1.MapsAPILoader, { useClass: lazy_maps_api_loader_1.LazyMapsAPILoader }),
	];


/***/ },

/***/ 176:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var http_1 = __webpack_require__(62);
	var CheckImageDirective = (function () {
	    function CheckImageDirective(el, renderer, http) {
	        this.el = el;
	        this.renderer = renderer;
	        this.http = http;
	    }
	    Object.defineProperty(CheckImageDirective.prototype, "checkimage", {
	        set: function (value) {
	            if (this.onchanges) {
	                this.image = value;
	                this._displayImage();
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    ;
	    CheckImageDirective.prototype.ngAfterViewInit = function () {
	        this._displayImage();
	    };
	    CheckImageDirective.prototype.ngOnDestroy = function () {
	        if (this.serviceInstance) {
	            this.serviceInstance.unsubscribe();
	        }
	    };
	    CheckImageDirective.prototype.setBackgroundImage = function (url) {
	        this.renderer.setElementStyle(this.el.nativeElement, 'backgroundImage', url);
	    };
	    CheckImageDirective.prototype._displayImage = function () {
	        var imageUrl = this.image + this.suffix;
	        // if image is empty or default avatar
	        if (this.image === '/static/assets/images/empty_avatar.png'
	            || this.image === '' || this.image === null) {
	            this.setBackgroundImage("url(/static/assets/images/empty_avatar.png)");
	        }
	        else {
	            this._loadImage(imageUrl);
	        }
	    };
	    /**
	     * [_loadImage Try to load smaller image and fall back to original size]
	     * @param {[string]} url [image url]
	     */
	    CheckImageDirective.prototype._loadImage = function (url) {
	        var _this = this;
	        if (url) {
	            this.serviceInstance = this.http.head(url)
	                .subscribe(function (data) {
	                _this.setBackgroundImage("url(" + url + ")");
	            }, function (err) {
	                _this.setBackgroundImage("url(" + _this.image + ")");
	            });
	        }
	    };
	    __decorate([
	        core_1.Input(), 
	        __metadata('design:type', String), 
	        __metadata('design:paramtypes', [String])
	    ], CheckImageDirective.prototype, "checkimage", null);
	    CheckImageDirective = __decorate([
	        core_1.Directive({
	            selector: '[checkimage]',
	            properties: ['image: checkimage', 'suffix', 'onchanges']
	        }), 
	        __metadata('design:paramtypes', [core_1.ElementRef, core_1.Renderer, http_1.Http])
	    ], CheckImageDirective);
	    return CheckImageDirective;
	}());
	exports.CheckImageDirective = CheckImageDirective;


/***/ },

/***/ 177:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var DropdownDirective = (function () {
	    function DropdownDirective(el) {
	        this.el = el;
	    }
	    DropdownDirective.prototype.onClick = function (event) {
	        jQuery(this.target).toggleClass('is-active');
	    };
	    ;
	    DropdownDirective.prototype.ngOnDestroy = function () {
	        jQuery(this.target).removeClass('is-active');
	    };
	    __decorate([
	        core_1.HostListener('click'), 
	        __metadata('design:type', Function), 
	        __metadata('design:paramtypes', [Event]), 
	        __metadata('design:returntype', void 0)
	    ], DropdownDirective.prototype, "onClick", null);
	    DropdownDirective = __decorate([
	        core_1.Directive({
	            selector: '[dropdown]',
	            properties: ['target: dropdown']
	        }), 
	        __metadata('design:paramtypes', [core_1.ElementRef])
	    ], DropdownDirective);
	    return DropdownDirective;
	}());
	exports.DropdownDirective = DropdownDirective;


/***/ },

/***/ 178:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var person_1 = __webpack_require__(107);
	var GenderPipe = (function () {
	    function GenderPipe() {
	    }
	    GenderPipe.prototype.transform = function (value, args) {
	        return person_1.Person.parseGender(value);
	    };
	    GenderPipe = __decorate([
	        core_1.Injectable(),
	        core_1.Pipe({
	            name: 'gender'
	        }), 
	        __metadata('design:paramtypes', [])
	    ], GenderPipe);
	    return GenderPipe;
	}());
	exports.GenderPipe = GenderPipe;


/***/ },

/***/ 180:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(287));
	__export(__webpack_require__(289));
	__export(__webpack_require__(288));
	__export(__webpack_require__(132));


/***/ },

/***/ 181:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(290));
	__export(__webpack_require__(133));
	__export(__webpack_require__(292));
	__export(__webpack_require__(291));


/***/ },

/***/ 261:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var social_network_1 = __webpack_require__(92);
	var SocialNetworkFacebook = (function (_super) {
	    __extends(SocialNetworkFacebook, _super);
	    function SocialNetworkFacebook(id) {
	        _super.call(this);
	        this.networkName = 'facebook';
	        this.name = this.networkName;
	        this.url = "https://www.facebook.com/app_scoped_user_id/" + id;
	    }
	    return SocialNetworkFacebook;
	}(social_network_1.SocialNetwork));
	exports.SocialNetworkFacebook = SocialNetworkFacebook;


/***/ },

/***/ 262:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var social_network_1 = __webpack_require__(92);
	var SocialNetworkLinkedin = (function (_super) {
	    __extends(SocialNetworkLinkedin, _super);
	    function SocialNetworkLinkedin(id) {
	        _super.call(this);
	        this.networkName = 'linkedin';
	        this.name = this.networkName;
	        this.url = id && id !== null ? id : '';
	    }
	    return SocialNetworkLinkedin;
	}(social_network_1.SocialNetwork));
	exports.SocialNetworkLinkedin = SocialNetworkLinkedin;


/***/ },

/***/ 263:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var social_network_1 = __webpack_require__(92);
	var SocialNetworkTwitter = (function (_super) {
	    __extends(SocialNetworkTwitter, _super);
	    function SocialNetworkTwitter(id) {
	        _super.call(this);
	        this.networkName = 'twitter';
	        this.name = this.networkName;
	        this.url = id && id !== null ? "https://twitter.com/" + id : '';
	    }
	    return SocialNetworkTwitter;
	}(social_network_1.SocialNetwork));
	exports.SocialNetworkTwitter = SocialNetworkTwitter;


/***/ },

/***/ 264:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(752));
	__export(__webpack_require__(751));


/***/ },

/***/ 272:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var google_map_1 = __webpack_require__(128);
	var google_map_marker_1 = __webpack_require__(127);
	exports.ANGULAR2_GOOGLE_MAPS_DIRECTIVES = [google_map_1.GoogleMap, google_map_marker_1.GoogleMapMarker];


/***/ },

/***/ 273:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var google_map_1 = __webpack_require__(128);
	exports.GoogleMap = google_map_1.GoogleMap;
	var google_map_marker_1 = __webpack_require__(127);
	exports.GoogleMapMarker = google_map_marker_1.GoogleMapMarker;
	var directives_const_1 = __webpack_require__(272);
	exports.ANGULAR2_GOOGLE_MAPS_DIRECTIVES = directives_const_1.ANGULAR2_GOOGLE_MAPS_DIRECTIVES;


/***/ },

/***/ 274:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var maps_api_loader_1 = __webpack_require__(50);
	exports.MapsAPILoader = maps_api_loader_1.MapsAPILoader;
	var noop_maps_api_loader_1 = __webpack_require__(275);
	exports.NoOpMapsAPILoader = noop_maps_api_loader_1.NoOpMapsAPILoader;
	var lazy_maps_api_loader_1 = __webpack_require__(130);
	exports.LazyMapsAPILoader = lazy_maps_api_loader_1.LazyMapsAPILoader;
	exports.LazyMapsAPILoaderConfig = lazy_maps_api_loader_1.LazyMapsAPILoaderConfig;
	exports.GoogleMapsScriptProtocol = lazy_maps_api_loader_1.GoogleMapsScriptProtocol;


/***/ },

/***/ 275:
/***/ function(module, exports) {

	"use strict";
	/**
	 * When using the NoOpMapsAPILoader, the Google Maps API must be added to the page via a `<script>`
	 * Tag.
	 * It's important that the Google Maps API script gets loaded first on the page.
	 */
	var NoOpMapsAPILoader = (function () {
	    function NoOpMapsAPILoader() {
	    }
	    NoOpMapsAPILoader.prototype.load = function () {
	        if (!window.google || !window.google.maps) {
	            throw new Error('Google Maps API not loaded on page. Make sure window.google.maps is available!');
	        }
	        return Promise.resolve();
	    };
	    ;
	    return NoOpMapsAPILoader;
	}());
	exports.NoOpMapsAPILoader = NoOpMapsAPILoader;


/***/ },

/***/ 278:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var CropDirective = (function () {
	    function CropDirective(el) {
	        this.el = el;
	        this.cropResult = new core_1.EventEmitter();
	    }
	    CropDirective.prototype.ngOnChanges = function (values) {
	        if (this.croppieInstance && values.image && values.image.currentValue) {
	            this.croppieInstance.croppie('bind', {
	                url: values.image.currentValue
	            });
	        }
	    };
	    CropDirective.prototype.ngAfterViewInit = function () {
	        var _this = this;
	        var opts = JSON.parse(this.options);
	        opts.update = function (cropper) {
	            _this.cropImage();
	        };
	        this.croppieInstance = jQuery(this.el.nativeElement).croppie(opts);
	        if (this.image !== '') {
	            this.croppieInstance.croppie('bind', {
	                url: this.image
	            });
	        }
	    };
	    CropDirective.prototype.ngOnDestroy = function () {
	        if (this.croppieInstance) {
	            this.croppieInstance.croppie('destroy');
	        }
	    };
	    CropDirective.prototype.cropImage = function () {
	        var _this = this;
	        this.croppieInstance.croppie('result', 'html').then(function (img) {
	            // prepare box subrectangle from cropped image
	            var leftOffset = Math.abs(parseInt(img.getElementsByTagName('img')[0].style.left, 10));
	            var topOffset = Math.abs(parseInt(img.getElementsByTagName('img')[0].style.top, 10));
	            var width = parseInt(img.style.width, 10);
	            var height = parseInt(img.style.height, 10);
	            var bounds = {
	                left: leftOffset,
	                upper: topOffset,
	                right: leftOffset + width,
	                lower: topOffset + height
	            };
	            _this.cropResult.next(bounds);
	        });
	    };
	    __decorate([
	        core_1.Output(), 
	        __metadata('design:type', core_1.EventEmitter)
	    ], CropDirective.prototype, "cropResult", void 0);
	    CropDirective = __decorate([
	        core_1.Directive({
	            selector: '[croppie]',
	            properties: ['options: croppie', 'image', 'crop']
	        }), 
	        __metadata('design:paramtypes', [core_1.ElementRef])
	    ], CropDirective);
	    return CropDirective;
	}());
	exports.CropDirective = CropDirective;


/***/ },

/***/ 279:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var core_2 = __webpack_require__(5);
	var DatepickerDirective = (function () {
	    function DatepickerDirective(el) {
	        this.selectedValue = new core_1.EventEmitter();
	        this.el = el;
	    }
	    DatepickerDirective.prototype.ngAfterViewInit = function () {
	        var _this = this;
	        jQuery(this.el.nativeElement).pickadate({
	            format: 'mm/dd/yyyy',
	            formatSubmit: 'mm/dd/yyyy',
	            onSet: function (context) {
	                var dateString = '';
	                if ('object' === typeof context.select) {
	                    dateString = core_2.DateUtil.convertFromUnixToDate(context.select.pick / 1000);
	                }
	                else {
	                    dateString = core_2.DateUtil.convertFromUnixToDate(context.select / 1000);
	                }
	                _this.selectedValue.next(dateString);
	            },
	            onStart: function () {
	                jQuery(_this.el.nativeElement).pickadate('picker').set('select', parseInt(_this.value, 10));
	            }
	        });
	    };
	    __decorate([
	        core_1.Output(), 
	        __metadata('design:type', core_1.EventEmitter)
	    ], DatepickerDirective.prototype, "selectedValue", void 0);
	    DatepickerDirective = __decorate([
	        core_1.Directive({
	            selector: '[datepicker]',
	            properties: ['value: datepicker']
	        }), 
	        __metadata('design:paramtypes', [core_1.ElementRef])
	    ], DatepickerDirective);
	    return DatepickerDirective;
	}());
	exports.DatepickerDirective = DatepickerDirective;


/***/ },

/***/ 280:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var maps_api_loader_1 = __webpack_require__(50);
	__webpack_require__(334);
	var GeocompleteDirective = (function () {
	    function GeocompleteDirective(el, _loader) {
	        this.el = el;
	        this._loader = _loader;
	        this.selectedValue = new core_1.EventEmitter();
	    }
	    GeocompleteDirective.prototype.ngOnInit = function () {
	        var _this = this;
	        // lazy load google maps api
	        if (!(typeof google === 'object' && typeof google.maps === 'object')) {
	            this._loader.load().then(function () {
	                _this.instance = jQuery(_this.el.nativeElement).geocomplete({
	                    types: ['establishment', 'geocode']
	                }).bind('geocode:result', function (event, result) {
	                    _this.selectedValue.next(result);
	                });
	            });
	        }
	        else {
	            // google maps api is already loaded
	            this.instance = jQuery(this.el.nativeElement).geocomplete({
	                types: ['establishment', 'geocode']
	            }).bind('geocode:result', function (event, result) {
	                _this.selectedValue.next(result);
	            });
	        }
	    };
	    GeocompleteDirective.prototype.ngOnDestroy = function () {
	        if (this.instance) {
	            jQuery(this.el.nativeElement).geocomplete('destroy');
	            jQuery('.pac-container').remove();
	        }
	    };
	    __decorate([
	        core_1.Output(), 
	        __metadata('design:type', core_1.EventEmitter)
	    ], GeocompleteDirective.prototype, "selectedValue", void 0);
	    GeocompleteDirective = __decorate([
	        core_1.Directive({
	            selector: '[geocomplete]'
	        }), 
	        __metadata('design:paramtypes', [core_1.ElementRef, maps_api_loader_1.MapsAPILoader])
	    ], GeocompleteDirective);
	    return GeocompleteDirective;
	}());
	exports.GeocompleteDirective = GeocompleteDirective;


/***/ },

/***/ 281:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var RemodalDirective = (function () {
	    function RemodalDirective(el) {
	        this.el = el;
	    }
	    RemodalDirective.prototype.ngAfterViewInit = function () {
	        this.initializeModal();
	    };
	    RemodalDirective.prototype.initializeModal = function () {
	        var options = {
	            hashTracking: false,
	            closeOnOutsideClick: false
	        };
	        if (this.options) {
	            options = JSON.parse(this.options);
	        }
	        jQuery(this.el.nativeElement).remodal(options);
	    };
	    RemodalDirective.prototype.ngOnDestroy = function () {
	        jQuery(this.el.nativeElement).remodal().destroy();
	    };
	    RemodalDirective = __decorate([
	        core_1.Directive({
	            selector: '[remodal]',
	            properties: ['options: remodal']
	        }), 
	        __metadata('design:paramtypes', [core_1.ElementRef])
	    ], RemodalDirective);
	    return RemodalDirective;
	}());
	exports.RemodalDirective = RemodalDirective;


/***/ },

/***/ 282:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var SelectDirective = (function () {
	    function SelectDirective(el) {
	        this.el = el;
	        this.selectedValue = new core_1.EventEmitter();
	    }
	    SelectDirective.prototype.ngOnInit = function () {
	        var _this = this;
	        var changeCounter = 0;
	        jQuery(this.el.nativeElement).minimalect({
	            searchable: false,
	            onchange: function (value) {
	                changeCounter++;
	                if (changeCounter % 2 === 0) {
	                    _this.selectedValue.next(value);
	                }
	            }
	        });
	    };
	    __decorate([
	        core_1.Output(), 
	        __metadata('design:type', core_1.EventEmitter)
	    ], SelectDirective.prototype, "selectedValue", void 0);
	    SelectDirective = __decorate([
	        core_1.Directive({
	            selector: '[minimalect]'
	        }), 
	        __metadata('design:paramtypes', [core_1.ElementRef])
	    ], SelectDirective);
	    return SelectDirective;
	}());
	exports.SelectDirective = SelectDirective;


/***/ },

/***/ 283:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var SwiperDirective = (function () {
	    function SwiperDirective(el, _ngZone) {
	        this.el = el;
	        this._ngZone = _ngZone;
	    }
	    SwiperDirective.prototype.ngAfterViewInit = function () {
	        var _this = this;
	        var opts = JSON.parse(this.options);
	        setTimeout(function () {
	            _this.swiperInstance = new Swiper(jQuery(_this.el.nativeElement), opts);
	        });
	    };
	    SwiperDirective.prototype.ngOnDestroy = function () {
	        if (this.swiperInstance) {
	            this.swiperInstance.destroy(true, true);
	        }
	    };
	    SwiperDirective = __decorate([
	        core_1.Directive({
	            selector: '[swiper]',
	            properties: ['options: swiper', 'id']
	        }), 
	        __metadata('design:paramtypes', [core_1.ElementRef, core_1.NgZone])
	    ], SwiperDirective);
	    return SwiperDirective;
	}());
	exports.SwiperDirective = SwiperDirective;


/***/ },

/***/ 284:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var core_2 = __webpack_require__(5);
	var TimepickerDirective = (function () {
	    function TimepickerDirective(el) {
	        this.selectedValue = new core_1.EventEmitter();
	        this.el = el;
	    }
	    TimepickerDirective.prototype.ngAfterViewInit = function () {
	        var _this = this;
	        jQuery(this.el.nativeElement).pickatime({
	            onSet: function (context) {
	                var timeString = '';
	                if ('object' === typeof context.select) {
	                    timeString = core_2.DateUtil.convertToHours(context.select.pick);
	                }
	                else {
	                    timeString = core_2.DateUtil.convertToHours(context.select);
	                }
	                if (timeString !== 'NaN:NaN') {
	                    _this.selectedValue.next(timeString);
	                }
	                else {
	                    _this.selectedValue.next('Invalid time');
	                }
	            },
	            onStart: function () {
	                jQuery(_this.el.nativeElement).pickatime('picker').set('select', parseInt(_this.value, 10));
	            }
	        });
	    };
	    __decorate([
	        core_1.Output(), 
	        __metadata('design:type', core_1.EventEmitter)
	    ], TimepickerDirective.prototype, "selectedValue", void 0);
	    TimepickerDirective = __decorate([
	        core_1.Directive({
	            selector: '[timepicker]',
	            properties: ['value: timepicker']
	        }), 
	        __metadata('design:paramtypes', [core_1.ElementRef])
	    ], TimepickerDirective);
	    return TimepickerDirective;
	}());
	exports.TimepickerDirective = TimepickerDirective;


/***/ },

/***/ 285:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var NumeralPipe = (function () {
	    function NumeralPipe() {
	    }
	    NumeralPipe.prototype.transform = function (value, args) {
	        var retValue = '';
	        if (isNaN(value) || value == null) {
	            return '';
	        }
	        value = value.toFixed(~~'.');
	        var parts = value.split('.'), fnums = parts[0], decimals = parts[1] ? '.' + parts[1] : '';
	        retValue = fnums.replace(/(\d)(?=(?:\d{3})+$)/g, '$1' + ',') + decimals;
	        return retValue;
	    };
	    NumeralPipe = __decorate([
	        core_1.Injectable(),
	        core_1.Pipe({
	            name: 'numeral'
	        }), 
	        __metadata('design:paramtypes', [])
	    ], NumeralPipe);
	    return NumeralPipe;
	}());
	exports.NumeralPipe = NumeralPipe;


/***/ },

/***/ 287:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var LIST_TYPE = 'connections';
	var LIST_LIMIT = 12;
	var list_1 = __webpack_require__(135);
	var ConnectionsComponent = (function (_super) {
	    __extends(ConnectionsComponent, _super);
	    function ConnectionsComponent(listService, filterService, listRefreshTimeout) {
	        _super.call(this, listService, LIST_TYPE, LIST_LIMIT, 'username', listRefreshTimeout);
	        this.listService = listService;
	        this.filterService = filterService;
	        this.listRefreshTimeout = listRefreshTimeout;
	    }
	    ConnectionsComponent.prototype.subscribeToFilterServiceUpdates = function () {
	        var _this = this;
	        // Add observer for filter updates
	        this.filterService.addObserver(LIST_TYPE);
	        // When filter updates, automatically refresh list
	        this.filterService.observer(LIST_TYPE).subscribe(function (data) { return _this.onRefreshList(); });
	    };
	    ConnectionsComponent.prototype.clearServicesSubscriptions = function () {
	        this.filterService.observer(LIST_TYPE).unsubscribe();
	        this.filterService.removeObserver(LIST_TYPE);
	        if (this.serviceInstance) {
	            this.serviceInstance.unsubscribe();
	        }
	    };
	    return ConnectionsComponent;
	}(list_1.ListComponent));
	exports.ConnectionsComponent = ConnectionsComponent;


/***/ },

/***/ 288:
/***/ function(module, exports) {

	"use strict";
	exports.MockConnectionsEmpty = {
	    "meta": {
	        "limit": 12,
	        "next": null,
	        "offset": 0,
	        "previous": null,
	        "total_count": 0
	    },
	    "objects": []
	};
	exports.MockConnections = {
	    "meta": {
	        "limit": 12,
	        "next": null,
	        "offset": 0,
	        "previous": null,
	        "total_count": 10
	    },
	    "objects": [
	        {
	            "about": null,
	            "age": 35,
	            "distance": [
	                "2",
	                "miles"
	            ],
	            "es_score": 0.0016887686,
	            "facebook_id": "1385396868433643",
	            "first_name": "Nancy",
	            "friends_score": 5,
	            "gender": "f",
	            "goals": [
	                {}
	            ],
	            "id": "10",
	            "image": "/media/images/empty_avatar.png",
	            "interests": [
	                {
	                    "animals": 1,
	                    "antiques": 1,
	                    "archery": 1,
	                    "architecture": 1,
	                    "badminton": 0,
	                    "ballet": 0,
	                    "bar": 1,
	                    "base": 0,
	                    "bodybuilding": 0,
	                    "choreography": 0
	                }
	            ],
	            "last_name": "Greeneberg",
	            "likes": [
	                {}
	            ],
	            "linkedin_provider": null,
	            "offers": [
	                {}
	            ],
	            "photos": [],
	            "resource_uri": "/api/v1/matchfeed2/10/",
	            "score": 5,
	            "top_interests": [
	                {
	                    "animals": 1,
	                    "antiques": 1,
	                    "archery": 1
	                }
	            ],
	            "twitter_provider": null,
	            "twitter_username": null,
	            "user_id": "10"
	        },
	        {
	            "about": null,
	            "age": 35,
	            "distance": [
	                "2",
	                "miles"
	            ],
	            "es_score": 0.0011517769,
	            "facebook_id": "1375052616137842",
	            "first_name": "Lisa",
	            "friends_score": 5,
	            "gender": "f",
	            "goals": [
	                {}
	            ],
	            "id": "15",
	            "image": "/media/images/empty_avatar.png",
	            "interests": [
	                {
	                    "animals": 1,
	                    "antiques": 1,
	                    "archery": 1,
	                    "architecture": 1,
	                    "backpacking": 0,
	                    "badminton": 0,
	                    "ballet": 0,
	                    "bar": 1,
	                    "base": 0,
	                    "baseball": 0
	                }
	            ],
	            "last_name": "Changsky",
	            "likes": [
	                {}
	            ],
	            "linkedin_provider": null,
	            "offers": [
	                {}
	            ],
	            "photos": [],
	            "resource_uri": "/api/v1/matchfeed2/15/",
	            "score": 5,
	            "top_interests": [
	                {
	                    "animals": 1,
	                    "antiques": 1,
	                    "archery": 1
	                }
	            ],
	            "twitter_provider": null,
	            "twitter_username": null,
	            "user_id": "15"
	        },
	        {
	            "about": null,
	            "age": 35,
	            "distance": [
	                "10",
	                "meters"
	            ],
	            "es_score": 0.0010170789,
	            "facebook_id": "1385153378458664",
	            "first_name": "Mike",
	            "friends_score": 5,
	            "gender": "m",
	            "goals": [
	                {
	                    "learn python": 1
	                }
	            ],
	            "id": "3",
	            "image": "/media/images/empty_avatar.png",
	            "interests": [
	                {
	                    "animals": 1,
	                    "antiques": 1,
	                    "archery": 1,
	                    "architecture": 1,
	                    "backpacking": 0,
	                    "badminton": 0,
	                    "ballet": 0,
	                    "blogging": 0,
	                    "board": 0,
	                    "boats": 0
	                }
	            ],
	            "last_name": "Dinglesky",
	            "likes": [
	                {}
	            ],
	            "linkedin_provider": null,
	            "offers": [
	                {
	                    "teach javascript": 0
	                }
	            ],
	            "photos": [],
	            "resource_uri": "/api/v1/matchfeed2/3/",
	            "score": 5,
	            "top_interests": [
	                {
	                    "animals": 1,
	                    "antiques": 1,
	                    "python": 1
	                }
	            ],
	            "twitter_provider": null,
	            "twitter_username": null,
	            "user_id": "3"
	        },
	        {
	            "about": null,
	            "age": 35,
	            "distance": [
	                "2",
	                "miles"
	            ],
	            "es_score": 0.0010170789,
	            "facebook_id": "1383431048631867",
	            "first_name": "Mike",
	            "friends_score": 4,
	            "gender": "m",
	            "goals": [
	                {}
	            ],
	            "id": "13",
	            "image": "/media/images/empty_avatar.png",
	            "interests": [
	                {
	                    "acting": 0,
	                    "animals": 1,
	                    "antiques": 1,
	                    "architecture": 1,
	                    "astronomy": 0,
	                    "backpacking": 0,
	                    "blogging": 0,
	                    "board": 0,
	                    "camping": 0,
	                    "cars": 1
	                }
	            ],
	            "last_name": "Bowersstein",
	            "likes": [
	                {}
	            ],
	            "linkedin_provider": null,
	            "offers": [
	                {}
	            ],
	            "photos": [],
	            "resource_uri": "/api/v1/matchfeed2/13/",
	            "score": 4,
	            "top_interests": [
	                {
	                    "animals": 1,
	                    "antiques": 1,
	                    "cars": 1
	                }
	            ],
	            "twitter_provider": null,
	            "twitter_username": null,
	            "user_id": "13"
	        },
	        {
	            "about": null,
	            "age": 35,
	            "distance": [
	                "10",
	                "meters"
	            ],
	            "es_score": 0.00081880466,
	            "facebook_id": "1375138986129001",
	            "first_name": "Will",
	            "friends_score": 4,
	            "gender": "m",
	            "goals": [
	                {}
	            ],
	            "id": "7",
	            "image": "/media/images/empty_avatar.png",
	            "interests": [
	                {
	                    "badminton": 0,
	                    "ballet": 0,
	                    "bar": 1,
	                    "board": 0,
	                    "boats": 0,
	                    "bodybuilding": 0,
	                    "cars": 1,
	                    "chess": 1,
	                    "choreography": 1
	                }
	            ],
	            "last_name": "Letuchyberg",
	            "likes": [
	                {}
	            ],
	            "linkedin_provider": null,
	            "offers": [
	                {}
	            ],
	            "photos": [],
	            "resource_uri": "/api/v1/matchfeed2/7/",
	            "score": 4,
	            "top_interests": [
	                {
	                    "bar": 1,
	                    "chess": 1,
	                    "choreography": 1
	                }
	            ],
	            "twitter_provider": null,
	            "twitter_username": null,
	            "user_id": "7"
	        },
	        {
	            "about": null,
	            "age": 35,
	            "distance": [
	                "2",
	                "miles"
	            ],
	            "es_score": 0.00081880466,
	            "facebook_id": "1385484028425118",
	            "first_name": "Rick",
	            "friends_score": 4,
	            "gender": "m",
	            "goals": [
	                {}
	            ],
	            "id": "12",
	            "image": "/media/images/empty_avatar.png",
	            "interests": [
	                {
	                    "antiques": 1,
	                    "archery": 1,
	                    "architecture": 1,
	                    "art": 0,
	                    "badminton": 0,
	                    "ballet": 0,
	                    "bar": 1,
	                    "base": 0,
	                    "baseball": 0
	                }
	            ],
	            "last_name": "Alisonwitz",
	            "likes": [
	                {}
	            ],
	            "linkedin_provider": null,
	            "offers": [
	                {}
	            ],
	            "photos": [],
	            "resource_uri": "/api/v1/matchfeed2/12/",
	            "score": 4,
	            "top_interests": [
	                {
	                    "antiques": 1,
	                    "archery": 1,
	                    "bar": 1
	                }
	            ],
	            "twitter_provider": null,
	            "twitter_username": null,
	            "user_id": "12"
	        },
	        {
	            "about": null,
	            "age": 35,
	            "distance": [
	                "2",
	                "miles"
	            ],
	            "es_score": 0.0007590271,
	            "facebook_id": "1384487495192394",
	            "first_name": "Richard",
	            "friends_score": 3,
	            "gender": "m",
	            "goals": [
	                {}
	            ],
	            "id": "14",
	            "image": "/media/images/empty_avatar.png",
	            "interests": [
	                {
	                    "animals": 1,
	                    "antiques": 1,
	                    "archery": 1,
	                    "backpacking": 0,
	                    "badminton": 0,
	                    "ballet": 0,
	                    "bird": 0,
	                    "blogging": 0,
	                    "board": 0,
	                    "boats": 0
	                }
	            ],
	            "last_name": "Bharambeson",
	            "likes": [
	                {}
	            ],
	            "linkedin_provider": null,
	            "offers": [
	                {}
	            ],
	            "photos": [],
	            "resource_uri": "/api/v1/matchfeed2/14/",
	            "score": 3,
	            "top_interests": [
	                {
	                    "animals": 1,
	                    "antiques": 1,
	                    "archery": 1
	                }
	            ],
	            "twitter_provider": null,
	            "twitter_username": null,
	            "user_id": "14"
	        },
	        {
	            "about": null,
	            "age": 35,
	            "distance": [
	                "2",
	                "miles"
	            ],
	            "es_score": 0.00068588095,
	            "facebook_id": "1385928311714523",
	            "first_name": "Richard",
	            "friends_score": 5,
	            "gender": "m",
	            "goals": [
	                {
	                    "learn to skii": 0
	                }
	            ],
	            "id": "6",
	            "image": "/media/images/empty_avatar.png",
	            "interests": [
	                {
	                    "antiques": 1,
	                    "archery": 1,
	                    "architecture": 1,
	                    "art": 0,
	                    "badminton": 0,
	                    "ballet": 0,
	                    "bar": 1,
	                    "base": 0,
	                    "baseball": 0
	                }
	            ],
	            "last_name": "Sadanson",
	            "likes": [
	                {}
	            ],
	            "linkedin_provider": null,
	            "offers": [
	                {
	                    "teach angular": 1
	                }
	            ],
	            "photos": [],
	            "resource_uri": "/api/v1/matchfeed2/6/",
	            "score": 5,
	            "top_interests": [
	                {
	                    "angular": 1,
	                    "antiques": 1,
	                    "archery": 1
	                }
	            ],
	            "twitter_provider": null,
	            "twitter_username": null,
	            "user_id": "6"
	        },
	        {
	            "about": null,
	            "age": 35,
	            "distance": [
	                "2",
	                "miles"
	            ],
	            "es_score": 0.0005339659,
	            "facebook_id": "1381543392154600",
	            "first_name": "Jennifer",
	            "friends_score": 3,
	            "gender": "f",
	            "goals": [
	                {
	                    "teach skiing": 0
	                }
	            ],
	            "id": "5",
	            "image": "/media/images/empty_avatar.png",
	            "interests": [
	                {
	                    "antiques": 1,
	                    "badminton": 0,
	                    "ballet": 0,
	                    "blogging": 0,
	                    "board": 0,
	                    "bodybuilding": 0,
	                    "cars": 1,
	                    "choreography": 1,
	                    "crafts": 0,
	                    "crossfit": 0
	                }
	            ],
	            "last_name": "Zamoreson",
	            "likes": [
	                {}
	            ],
	            "linkedin_provider": null,
	            "offers": [
	                {
	                    "learn to dive": 0
	                }
	            ],
	            "photos": [],
	            "resource_uri": "/api/v1/matchfeed2/5/",
	            "score": 3,
	            "top_interests": [
	                {
	                    "antiques": 1,
	                    "cars": 1,
	                    "choreography": 1
	                }
	            ],
	            "twitter_provider": null,
	            "twitter_username": null,
	            "user_id": "5"
	        },
	        {
	            "about": null,
	            "age": 35,
	            "distance": [
	                "2",
	                "miles"
	            ],
	            "es_score": 0.00032437692,
	            "facebook_id": "1381376178837963",
	            "first_name": "Sharon",
	            "friends_score": 3,
	            "gender": "f",
	            "goals": [
	                {}
	            ],
	            "id": "11",
	            "image": "/media/images/empty_avatar.png",
	            "interests": [
	                {
	                    "antiques": 1,
	                    "archery": 1,
	                    "badminton": 0,
	                    "ballet": 0,
	                    "blogging": 0,
	                    "board": 0,
	                    "boats": 0,
	                    "chess": 1
	                }
	            ],
	            "last_name": "Zamoreman",
	            "likes": [
	                {}
	            ],
	            "linkedin_provider": null,
	            "offers": [
	                {}
	            ],
	            "photos": [],
	            "resource_uri": "/api/v1/matchfeed2/11/",
	            "score": 3,
	            "top_interests": [
	                {
	                    "antiques": 1,
	                    "archery": 1,
	                    "chess": 1
	                }
	            ],
	            "twitter_provider": null,
	            "twitter_username": null,
	            "user_id": "11"
	        }
	    ]
	};


/***/ },

/***/ 289:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var connections_service_1 = __webpack_require__(132);
	var rxjs_1 = __webpack_require__(35);
	var MockConnectionsService = (function (_super) {
	    __extends(MockConnectionsService, _super);
	    function MockConnectionsService() {
	        _super.apply(this, arguments);
	        this.fakeResponse = null;
	    }
	    MockConnectionsService.prototype.get = function (url, limit) {
	        return rxjs_1.Observable.of(this.fakeResponse);
	    };
	    MockConnectionsService.prototype.setResponse = function (response) {
	        this.fakeResponse = response;
	    };
	    MockConnectionsService.prototype.getProvider = function () {
	        return core_1.provide(connections_service_1.ConnectionsService, { useValue: this });
	    };
	    return MockConnectionsService;
	}(connections_service_1.ConnectionsService));
	exports.MockConnectionsService = MockConnectionsService;


/***/ },

/***/ 290:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var LIST_TYPE = 'crowd';
	var LIST_LIMIT = 12;
	var list_1 = __webpack_require__(135);
	var CrowdComponent = (function (_super) {
	    __extends(CrowdComponent, _super);
	    function CrowdComponent(listService, friendService, filterService, listRefreshTimeout) {
	        _super.call(this, listService, LIST_TYPE, LIST_LIMIT, 'username', listRefreshTimeout);
	        this.listService = listService;
	        this.friendService = friendService;
	        this.filterService = filterService;
	        this.listRefreshTimeout = listRefreshTimeout;
	    }
	    CrowdComponent.prototype.subscribeToFilterServiceUpdates = function () {
	        var _this = this;
	        // Add observer for filter updates
	        this.filterService.addObserver(LIST_TYPE);
	        // When filter updates, automatically refresh crowd list
	        this.filterService.observer(LIST_TYPE).subscribe(function (data) { return _this.onRefreshList(); });
	    };
	    CrowdComponent.prototype.clearServicesSubscriptions = function () {
	        this.filterService.observer(LIST_TYPE).unsubscribe();
	        this.filterService.removeObserver(LIST_TYPE);
	        if (this.serviceInstance) {
	            this.serviceInstance.unsubscribe();
	        }
	    };
	    CrowdComponent.prototype.accept = function (event) { };
	    CrowdComponent.prototype.pass = function (event) { };
	    return CrowdComponent;
	}(list_1.ListComponent));
	exports.CrowdComponent = CrowdComponent;


/***/ },

/***/ 291:
/***/ function(module, exports) {

	"use strict";
	exports.MockCrowdEmpty = {
	    "meta": {
	        "limit": 12,
	        "next": null,
	        "offset": 0,
	        "previous": null,
	        "total_count": 0
	    },
	    "objects": []
	};
	exports.MockCrowd = {
	    "meta": {
	        "limit": 12,
	        "next": null,
	        "offset": 0,
	        "previous": null,
	        "total_count": 10
	    },
	    "objects": [
	        {
	            "about": null,
	            "age": 35,
	            "distance": [
	                "2",
	                "miles"
	            ],
	            "es_score": 0.0016887686,
	            "facebook_id": "1385396868433643",
	            "first_name": "Nancy",
	            "friends_score": 5,
	            "gender": "f",
	            "goals": [
	                {}
	            ],
	            "id": "10",
	            "image": "/media/images/empty_avatar.png",
	            "interests": [
	                {
	                    "animals": 1,
	                    "antiques": 1,
	                    "archery": 1,
	                    "architecture": 1,
	                    "badminton": 0,
	                    "ballet": 0,
	                    "bar": 1,
	                    "base": 0,
	                    "bodybuilding": 0,
	                    "choreography": 0
	                }
	            ],
	            "last_name": "Greeneberg",
	            "likes": [
	                {}
	            ],
	            "linkedin_provider": null,
	            "offers": [
	                {}
	            ],
	            "photos": [],
	            "resource_uri": "/api/v1/matchfeed2/10/",
	            "score": 5,
	            "top_interests": [
	                {
	                    "animals": 1,
	                    "antiques": 1,
	                    "archery": 1
	                }
	            ],
	            "twitter_provider": null,
	            "twitter_username": null,
	            "user_id": "10"
	        },
	        {
	            "about": null,
	            "age": 35,
	            "distance": [
	                "2",
	                "miles"
	            ],
	            "es_score": 0.0011517769,
	            "facebook_id": "1375052616137842",
	            "first_name": "Lisa",
	            "friends_score": 5,
	            "gender": "f",
	            "goals": [
	                {}
	            ],
	            "id": "15",
	            "image": "/media/images/empty_avatar.png",
	            "interests": [
	                {
	                    "animals": 1,
	                    "antiques": 1,
	                    "archery": 1,
	                    "architecture": 1,
	                    "backpacking": 0,
	                    "badminton": 0,
	                    "ballet": 0,
	                    "bar": 1,
	                    "base": 0,
	                    "baseball": 0
	                }
	            ],
	            "last_name": "Changsky",
	            "likes": [
	                {}
	            ],
	            "linkedin_provider": null,
	            "offers": [
	                {}
	            ],
	            "photos": [],
	            "resource_uri": "/api/v1/matchfeed2/15/",
	            "score": 5,
	            "top_interests": [
	                {
	                    "animals": 1,
	                    "antiques": 1,
	                    "archery": 1
	                }
	            ],
	            "twitter_provider": null,
	            "twitter_username": null,
	            "user_id": "15"
	        },
	        {
	            "about": null,
	            "age": 35,
	            "distance": [
	                "10",
	                "meters"
	            ],
	            "es_score": 0.0010170789,
	            "facebook_id": "1385153378458664",
	            "first_name": "Mike",
	            "friends_score": 5,
	            "gender": "m",
	            "goals": [
	                {
	                    "learn python": 1
	                }
	            ],
	            "id": "3",
	            "image": "/media/images/empty_avatar.png",
	            "interests": [
	                {
	                    "animals": 1,
	                    "antiques": 1,
	                    "archery": 1,
	                    "architecture": 1,
	                    "backpacking": 0,
	                    "badminton": 0,
	                    "ballet": 0,
	                    "blogging": 0,
	                    "board": 0,
	                    "boats": 0
	                }
	            ],
	            "last_name": "Dinglesky",
	            "likes": [
	                {}
	            ],
	            "linkedin_provider": null,
	            "offers": [
	                {
	                    "teach javascript": 0
	                }
	            ],
	            "photos": [],
	            "resource_uri": "/api/v1/matchfeed2/3/",
	            "score": 5,
	            "top_interests": [
	                {
	                    "animals": 1,
	                    "antiques": 1,
	                    "python": 1
	                }
	            ],
	            "twitter_provider": null,
	            "twitter_username": null,
	            "user_id": "3"
	        },
	        {
	            "about": null,
	            "age": 35,
	            "distance": [
	                "2",
	                "miles"
	            ],
	            "es_score": 0.0010170789,
	            "facebook_id": "1383431048631867",
	            "first_name": "Mike",
	            "friends_score": 4,
	            "gender": "m",
	            "goals": [
	                {}
	            ],
	            "id": "13",
	            "image": "/media/images/empty_avatar.png",
	            "interests": [
	                {
	                    "acting": 0,
	                    "animals": 1,
	                    "antiques": 1,
	                    "architecture": 1,
	                    "astronomy": 0,
	                    "backpacking": 0,
	                    "blogging": 0,
	                    "board": 0,
	                    "camping": 0,
	                    "cars": 1
	                }
	            ],
	            "last_name": "Bowersstein",
	            "likes": [
	                {}
	            ],
	            "linkedin_provider": null,
	            "offers": [
	                {}
	            ],
	            "photos": [],
	            "resource_uri": "/api/v1/matchfeed2/13/",
	            "score": 4,
	            "top_interests": [
	                {
	                    "animals": 1,
	                    "antiques": 1,
	                    "cars": 1
	                }
	            ],
	            "twitter_provider": null,
	            "twitter_username": null,
	            "user_id": "13"
	        },
	        {
	            "about": null,
	            "age": 35,
	            "distance": [
	                "10",
	                "meters"
	            ],
	            "es_score": 0.00081880466,
	            "facebook_id": "1375138986129001",
	            "first_name": "Will",
	            "friends_score": 4,
	            "gender": "m",
	            "goals": [
	                {}
	            ],
	            "id": "7",
	            "image": "/media/images/empty_avatar.png",
	            "interests": [
	                {
	                    "badminton": 0,
	                    "ballet": 0,
	                    "bar": 1,
	                    "board": 0,
	                    "boats": 0,
	                    "bodybuilding": 0,
	                    "cars": 1,
	                    "chess": 1,
	                    "choreography": 1
	                }
	            ],
	            "last_name": "Letuchyberg",
	            "likes": [
	                {}
	            ],
	            "linkedin_provider": null,
	            "offers": [
	                {}
	            ],
	            "photos": [],
	            "resource_uri": "/api/v1/matchfeed2/7/",
	            "score": 4,
	            "top_interests": [
	                {
	                    "bar": 1,
	                    "chess": 1,
	                    "choreography": 1
	                }
	            ],
	            "twitter_provider": null,
	            "twitter_username": null,
	            "user_id": "7"
	        },
	        {
	            "about": null,
	            "age": 35,
	            "distance": [
	                "2",
	                "miles"
	            ],
	            "es_score": 0.00081880466,
	            "facebook_id": "1385484028425118",
	            "first_name": "Rick",
	            "friends_score": 4,
	            "gender": "m",
	            "goals": [
	                {}
	            ],
	            "id": "12",
	            "image": "/media/images/empty_avatar.png",
	            "interests": [
	                {
	                    "antiques": 1,
	                    "archery": 1,
	                    "architecture": 1,
	                    "art": 0,
	                    "badminton": 0,
	                    "ballet": 0,
	                    "bar": 1,
	                    "base": 0,
	                    "baseball": 0
	                }
	            ],
	            "last_name": "Alisonwitz",
	            "likes": [
	                {}
	            ],
	            "linkedin_provider": null,
	            "offers": [
	                {}
	            ],
	            "photos": [],
	            "resource_uri": "/api/v1/matchfeed2/12/",
	            "score": 4,
	            "top_interests": [
	                {
	                    "antiques": 1,
	                    "archery": 1,
	                    "bar": 1
	                }
	            ],
	            "twitter_provider": null,
	            "twitter_username": null,
	            "user_id": "12"
	        },
	        {
	            "about": null,
	            "age": 35,
	            "distance": [
	                "2",
	                "miles"
	            ],
	            "es_score": 0.0007590271,
	            "facebook_id": "1384487495192394",
	            "first_name": "Richard",
	            "friends_score": 3,
	            "gender": "m",
	            "goals": [
	                {}
	            ],
	            "id": "14",
	            "image": "/media/images/empty_avatar.png",
	            "interests": [
	                {
	                    "animals": 1,
	                    "antiques": 1,
	                    "archery": 1,
	                    "backpacking": 0,
	                    "badminton": 0,
	                    "ballet": 0,
	                    "bird": 0,
	                    "blogging": 0,
	                    "board": 0,
	                    "boats": 0
	                }
	            ],
	            "last_name": "Bharambeson",
	            "likes": [
	                {}
	            ],
	            "linkedin_provider": null,
	            "offers": [
	                {}
	            ],
	            "photos": [],
	            "resource_uri": "/api/v1/matchfeed2/14/",
	            "score": 3,
	            "top_interests": [
	                {
	                    "animals": 1,
	                    "antiques": 1,
	                    "archery": 1
	                }
	            ],
	            "twitter_provider": null,
	            "twitter_username": null,
	            "user_id": "14"
	        },
	        {
	            "about": null,
	            "age": 35,
	            "distance": [
	                "2",
	                "miles"
	            ],
	            "es_score": 0.00068588095,
	            "facebook_id": "1385928311714523",
	            "first_name": "Richard",
	            "friends_score": 5,
	            "gender": "m",
	            "goals": [
	                {
	                    "learn to skii": 0
	                }
	            ],
	            "id": "6",
	            "image": "/media/images/empty_avatar.png",
	            "interests": [
	                {
	                    "antiques": 1,
	                    "archery": 1,
	                    "architecture": 1,
	                    "art": 0,
	                    "badminton": 0,
	                    "ballet": 0,
	                    "bar": 1,
	                    "base": 0,
	                    "baseball": 0
	                }
	            ],
	            "last_name": "Sadanson",
	            "likes": [
	                {}
	            ],
	            "linkedin_provider": null,
	            "offers": [
	                {
	                    "teach angular": 1
	                }
	            ],
	            "photos": [],
	            "resource_uri": "/api/v1/matchfeed2/6/",
	            "score": 5,
	            "top_interests": [
	                {
	                    "angular": 1,
	                    "antiques": 1,
	                    "archery": 1
	                }
	            ],
	            "twitter_provider": null,
	            "twitter_username": null,
	            "user_id": "6"
	        },
	        {
	            "about": null,
	            "age": 35,
	            "distance": [
	                "2",
	                "miles"
	            ],
	            "es_score": 0.0005339659,
	            "facebook_id": "1381543392154600",
	            "first_name": "Jennifer",
	            "friends_score": 3,
	            "gender": "f",
	            "goals": [
	                {
	                    "teach skiing": 0
	                }
	            ],
	            "id": "5",
	            "image": "/media/images/empty_avatar.png",
	            "interests": [
	                {
	                    "antiques": 1,
	                    "badminton": 0,
	                    "ballet": 0,
	                    "blogging": 0,
	                    "board": 0,
	                    "bodybuilding": 0,
	                    "cars": 1,
	                    "choreography": 1,
	                    "crafts": 0,
	                    "crossfit": 0
	                }
	            ],
	            "last_name": "Zamoreson",
	            "likes": [
	                {}
	            ],
	            "linkedin_provider": null,
	            "offers": [
	                {
	                    "learn to dive": 0
	                }
	            ],
	            "photos": [],
	            "resource_uri": "/api/v1/matchfeed2/5/",
	            "score": 3,
	            "top_interests": [
	                {
	                    "antiques": 1,
	                    "cars": 1,
	                    "choreography": 1
	                }
	            ],
	            "twitter_provider": null,
	            "twitter_username": null,
	            "user_id": "5"
	        },
	        {
	            "about": null,
	            "age": 35,
	            "distance": [
	                "2",
	                "miles"
	            ],
	            "es_score": 0.00032437692,
	            "facebook_id": "1381376178837963",
	            "first_name": "Sharon",
	            "friends_score": 3,
	            "gender": "f",
	            "goals": [
	                {}
	            ],
	            "id": "11",
	            "image": "/media/images/empty_avatar.png",
	            "interests": [
	                {
	                    "antiques": 1,
	                    "archery": 1,
	                    "badminton": 0,
	                    "ballet": 0,
	                    "blogging": 0,
	                    "board": 0,
	                    "boats": 0,
	                    "chess": 1
	                }
	            ],
	            "last_name": "Zamoreman",
	            "likes": [
	                {}
	            ],
	            "linkedin_provider": null,
	            "offers": [
	                {}
	            ],
	            "photos": [],
	            "resource_uri": "/api/v1/matchfeed2/11/",
	            "score": 3,
	            "top_interests": [
	                {
	                    "antiques": 1,
	                    "archery": 1,
	                    "chess": 1
	                }
	            ],
	            "twitter_provider": null,
	            "twitter_username": null,
	            "user_id": "11"
	        }
	    ]
	};


/***/ },

/***/ 292:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var crowd_service_1 = __webpack_require__(133);
	var rxjs_1 = __webpack_require__(35);
	var MockCrowdService = (function (_super) {
	    __extends(MockCrowdService, _super);
	    function MockCrowdService() {
	        _super.apply(this, arguments);
	        this.fakeResponse = null;
	    }
	    MockCrowdService.prototype.get = function (url, limit) {
	        return rxjs_1.Observable.of(this.fakeResponse);
	    };
	    MockCrowdService.prototype.setResponse = function (response) {
	        this.fakeResponse = response;
	    };
	    MockCrowdService.prototype.getProvider = function () {
	        return core_1.provide(crowd_service_1.CrowdService, { useValue: this });
	    };
	    return MockCrowdService;
	}(crowd_service_1.CrowdService));
	exports.MockCrowdService = MockCrowdService;


/***/ },

/***/ 293:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var browser_adapter_1 = __webpack_require__(78);
	var InfiniteScrollDirective = (function () {
	    function InfiniteScrollDirective(_dom) {
	        this._dom = _dom;
	        this.scrolled = new core_1.EventEmitter();
	    }
	    InfiniteScrollDirective.prototype.onScrolledBottom = function () {
	        this._triggerMenu();
	    };
	    InfiniteScrollDirective.prototype._triggerMenu = function () {
	        var scrollOffset = window.pageYOffset
	            || document.documentElement.scrollTop
	            || document.body.scrollTop || 0;
	        var threshold = jQuery(document).height() - jQuery(window).height() - this.bottomOffset;
	        if (scrollOffset > threshold && this.scrollEnabled) {
	            this.scrolled.next(true);
	        }
	    };
	    __decorate([
	        core_1.Input(), 
	        __metadata('design:type', Boolean)
	    ], InfiniteScrollDirective.prototype, "scrollEnabled", void 0);
	    __decorate([
	        core_1.Input(), 
	        __metadata('design:type', Number)
	    ], InfiniteScrollDirective.prototype, "bottomOffset", void 0);
	    __decorate([
	        core_1.Output(), 
	        __metadata('design:type', core_1.EventEmitter)
	    ], InfiniteScrollDirective.prototype, "scrolled", void 0);
	    __decorate([
	        core_1.HostListener('window:scroll'), 
	        __metadata('design:type', Function), 
	        __metadata('design:paramtypes', []), 
	        __metadata('design:returntype', void 0)
	    ], InfiniteScrollDirective.prototype, "onScrolledBottom", null);
	    InfiniteScrollDirective = __decorate([
	        core_1.Directive({
	            selector: '[prs-infinite-scroll]',
	            providers: [browser_adapter_1.BrowserDomAdapter]
	        }), 
	        __metadata('design:paramtypes', [browser_adapter_1.BrowserDomAdapter])
	    ], InfiniteScrollDirective);
	    return InfiniteScrollDirective;
	}());
	exports.InfiniteScrollDirective = InfiniteScrollDirective;


/***/ },

/***/ 294:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var lodash_1 = __webpack_require__(30);
	var models_1 = __webpack_require__(64);
	var FilterComponent = (function () {
	    function FilterComponent(filterService) {
	        var _this = this;
	        this.filterService = filterService;
	        this.showGender = true;
	        this.gender = 'm,f';
	        this.order = 'match_score';
	        this.distanceValue = 10000;
	        this.distanceUnit = 'miles';
	        this.minAge = 25;
	        this.maxAge = 60;
	        this.renderSlider = false;
	        this.orderBy = [
	            {
	                'label': 'Similarity',
	                'value': 'match_score',
	                'selected': false
	            },
	            {
	                'label': 'Distance',
	                'value': 'distance',
	                'selected': false
	            },
	            {
	                'label': 'Date',
	                'value': 'date',
	                'selected': false
	            },
	            {
	                'label': 'Mutual Friends',
	                'value': 'mutual_friends',
	                'selected': false
	            }
	        ];
	        this.rangeSliderOptionsAge = {
	            hide_min_max: true,
	            hide_from_to: true,
	            keyboard: true,
	            min: 18,
	            max: 115,
	            from: 25,
	            to: 60,
	            type: 'double',
	            step: 1
	        };
	        this.rangeSliderOptionsDistance = {
	            hide_min_max: true,
	            hide_from_to: true,
	            keyboard: true,
	            min: 0,
	            max: 10000,
	            step: 1,
	            from: 0,
	            type: 'single'
	        };
	        this.timeoutIdFiltersSave = null;
	        this.saveDebounced = lodash_1.debounce(this.save, 500, { 'leading': true, 'trailing': true });
	        this.filterService.find()
	            .subscribe(function (data) { return _this.setFilters(data); }, function (err) {
	            console.log(err);
	        }, function () {
	        });
	        this.defaultState = this.filterService.getDefaultState();
	        this.filters = new models_1.FilterModel(this.defaultState);
	    }
	    FilterComponent.prototype.changeGender = function (value) {
	        if (this.gender !== value) {
	            this.gender = value;
	            this.filters.state.gender = value;
	            this.saveDebounced();
	        }
	    };
	    FilterComponent.prototype.changeOrder = function (value) {
	        var index = lodash_1.findIndex(this.orderBy, function (option) {
	            return option['value'].toLowerCase() === value.toLowerCase();
	        });
	        if (this.order !== value) {
	            this.order = value;
	            this.filters.state.order_criteria = this.orderBy[index]['value'];
	            this.saveDebounced();
	        }
	    };
	    FilterComponent.prototype.ageChanged = function (value) {
	        this.minAge = value.from;
	        this.maxAge = value.to;
	    };
	    FilterComponent.prototype.saveAge = function (value) {
	        this.filters.state.min_age = value.from;
	        this.filters.state.max_age = value.to;
	        this.saveDebounced();
	    };
	    FilterComponent.prototype.distanceChanged = function (value) {
	        this.distanceValue = value.from;
	    };
	    FilterComponent.prototype.saveDistance = function (value) {
	        this.filters.state.distance = value.from;
	        this.saveDebounced();
	    };
	    FilterComponent.prototype.setFilters = function (data) {
	        var _this = this;
	        this.filters = new models_1.FilterModel(data.objects[0]);
	        this.gender = this.filters.state.gender;
	        this.minAge = this.filters.state.min_age;
	        this.maxAge = this.filters.state.max_age;
	        this.rangeSliderOptionsAge.from = parseInt(this.minAge, 10);
	        this.rangeSliderOptionsAge.to = parseInt(this.maxAge, 10);
	        this.distanceValue = this.filters.state.distance;
	        this.rangeSliderOptionsDistance.from = parseInt(this.distanceValue, 10);
	        //trigger change for rerender Slider plugin
	        this.renderSlider = !this.renderSlider;
	        this.distanceUnit = this.filters.state.distance_unit;
	        this.order = this.filters.state.order_criteria;
	        var index = lodash_1.findIndex(this.orderBy, function (option) {
	            return option['value'] === _this.filters.state.order_criteria.toLowerCase();
	        });
	        if (index !== -1) {
	            this.orderBy[index]['selected'] = true;
	        }
	        else {
	            //set match score as default selected option
	            this.orderBy[0]['selected'] = true;
	        }
	    };
	    FilterComponent.prototype.save = function () {
	        var _this = this;
	        //prevent saving keywords
	        delete this.filters.state.keyword;
	        this.filterService
	            .updateOne(this.filters.state.resource_uri, this.filters.state)
	            .subscribe(function (res) {
	            _this.filterService.publishObservers();
	        });
	    };
	    __decorate([
	        core_1.Input(), 
	        __metadata('design:type', Object)
	    ], FilterComponent.prototype, "showGender", void 0);
	    __decorate([
	        core_1.Input(), 
	        __metadata('design:type', Object)
	    ], FilterComponent.prototype, "type", void 0);
	    return FilterComponent;
	}());
	exports.FilterComponent = FilterComponent;


/***/ },

/***/ 295:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(294));


/***/ },

/***/ 296:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var lodash_1 = __webpack_require__(30);
	var DEFAULT_LIST_LIMIT = 12;
	;
	var ListComponent = (function () {
	    function ListComponent(listService, listType, listLimit, urlProperty, listRefreshTimeout) {
	        this.listService = listService;
	        this.listType = listType;
	        this.listLimit = listLimit;
	        this.urlProperty = urlProperty;
	        this.listRefreshTimeout = listRefreshTimeout;
	        // Collection of items managed by this component.
	        this.items = [];
	        // Loading indicators
	        this.loading = false;
	        this.loadingInitial = false;
	        // Indicator whether list of items is empty.
	        // Changes to true when initial loading of items returns 0 results.
	        this.isListEmpty = false;
	        // Indicator for whether there are more items to load from API
	        this.next = '';
	        // Total count of items loaded
	        this.total_count = 0;
	        // Limit for page size
	        this.limit = DEFAULT_LIST_LIMIT;
	        // Indicator for showing indidividual items
	        this.itemViewActive = false;
	        // Selected item to show
	        this.selectedItem = null;
	        // Index of selectedItem
	        this.currentIndex = 0;
	        // Way to temporarily remember scroll position before item is selected
	        // and restore it after item view is closed.
	        this.windowScrollPosition = 0;
	        this.limit = listLimit;
	        this.onRefreshList = lodash_1.debounce(this._refreshList, listRefreshTimeout, {
	            'leading': false,
	            'trailing': true
	        });
	    }
	    /**
	     * Load items from listService
	     */
	    ListComponent.prototype.getList = function () {
	        var _this = this;
	        if (this.loading) {
	            return;
	        }
	        this.isListEmpty = false;
	        if (this.next === null)
	            return;
	        this.loading = true;
	        if (this.next === '') {
	            this.loadingInitial = true;
	        }
	        this.serviceInstance = this.listService.get(this.next, this.limit)
	            .subscribe(function (data) {
	            _this._assignList(data);
	        }, function (err) {
	            _this.loading = false;
	            _this.loadingInitial = false;
	        });
	    };
	    /**
	     * Select item by id atrribute
	     * @param {number} id of selected item
	     */
	    ListComponent.prototype.selectItem = function (itemId) {
	        this.beforeItemSelected();
	        // Find index of item with item.id === itemId in items collection
	        var index = lodash_1.findIndex(this.items, { id: itemId });
	        // If item is found, select it and call afterItemSelected() function
	        if (index !== -1) {
	            this.selectedItem = this.items[index];
	            this.currentIndex = index;
	            this.itemViewActive = true;
	            this.afterItemSelected();
	        }
	    };
	    /**
	     * Change URL of browser window to chosen item attribute
	     * @param {string} value of item attribute
	     */
	    ListComponent.prototype.setLocation = function (value) {
	        window.history.pushState('', '', '/' + value);
	    };
	    /**
	     * Close viewing of selectedItem
	     * @param {DOM event} event
	     */
	    ListComponent.prototype.closeItemView = function (event) {
	        this.itemViewActive = false;
	        this.selectedItem = null;
	        this.afterItemClosed();
	    };
	    /**
	     * Select previous item from items list and update currentIndex and selectedItem
	     * @param {DOM event} event
	     */
	    ListComponent.prototype.previousItem = function (event) {
	        var currentIndex = lodash_1.findIndex(this.items, { id: this.selectedItem.id });
	        var newIndex = currentIndex - 1;
	        if (newIndex < 0) {
	            return;
	        }
	        if (this.items.length > 0) {
	            this.selectedItem = this.items[newIndex];
	            this.setLocation(this.selectedItem[this.urlProperty]);
	        }
	        else {
	            this.closeItemView(true);
	            this.isListEmpty = true;
	        }
	        this.currentIndex = newIndex;
	    };
	    /**
	     * Select next item from items list and update currentIndex and selectedItem
	     * @param {DOM event} event
	     */
	    ListComponent.prototype.nextItem = function (event) {
	        var currentIndex = lodash_1.findIndex(this.items, { id: this.selectedItem.id });
	        var newIndex = currentIndex + 1;
	        if (!this.loading && newIndex > this.items.length - 13 && this.next) {
	            this.getList();
	        }
	        if (newIndex > this.items.length - 1) {
	            return;
	        }
	        if (this.items.length > 0) {
	            this.selectedItem = this.items[newIndex];
	            this.setLocation(this.selectedItem[this.urlProperty]);
	        }
	        else {
	            this.closeItemView(true);
	            this.isListEmpty = true;
	        }
	        this.currentIndex = newIndex;
	    };
	    /**
	     * Find and remove item with item.id === itemId from items list
	     * @param {number} id [description]
	     */
	    ListComponent.prototype.removeItemById = function (itemId) {
	        lodash_1.remove(this.items, function (item) {
	            return item.id === itemId;
	        });
	        this.total_count--;
	    };
	    /**
	     * Load more items from listService
	     * @param {DOM event} event
	     */
	    ListComponent.prototype.loadMoreItems = function (event) {
	        if (this.next && !this.loading) {
	            this.getList();
	        }
	    };
	    /**
	     * Temporarily remember window scroll position
	     */
	    ListComponent.prototype.saveScrollPosition = function () {
	        this.windowScrollPosition = jQuery(window).scrollTop();
	    };
	    /**
	     * Restore window scroll position
	     */
	    ListComponent.prototype.restoreScrollPosition = function () {
	        var _this = this;
	        setTimeout(function () {
	            jQuery(window).scrollTop(_this.windowScrollPosition);
	        });
	    };
	    /**
	     * Function which executres after viewing of selectedItem is closed
	     * @param {any} optional param
	     */
	    ListComponent.prototype.afterItemClosed = function (param) { };
	    /**
	     * Function which executes after item is selected
	     * @param {any} optional param
	     */
	    ListComponent.prototype.afterItemSelected = function (param) { };
	    /**
	     * Function which executes immediately before item is selected
	     * @param {any} optional param
	     */
	    ListComponent.prototype.beforeItemSelected = function (param) { };
	    /**
	     * Remove all items, reset all indicator variables and
	     * reload new data from listService
	     */
	    ListComponent.prototype._refreshList = function () {
	        this.items = [];
	        this.total_count = 0;
	        this.currentIndex = 0;
	        this.isListEmpty = false;
	        this.next = '';
	        this.getList();
	    };
	    /**
	     * Assign data from listService into items collection
	     * @param {any} data
	     */
	    ListComponent.prototype._assignList = function (data) {
	        this.loading = false;
	        this.loadingInitial = false;
	        if (data.meta.total_count === 0) {
	            this.isListEmpty = true;
	            return;
	        }
	        else {
	            this.isListEmpty = false;
	        }
	        if (this.items.length > 0) {
	            var more = data.objects;
	            for (var i = 0; i <= more.length - 1; i++) {
	                this.items = this.items.concat([more[i]]);
	            }
	            this.total_count += more.length;
	        }
	        else {
	            this.items = data.objects;
	            this.total_count = data.objects.length;
	        }
	        this.next = data.meta.next;
	    };
	    return ListComponent;
	}());
	exports.ListComponent = ListComponent;


/***/ },

/***/ 298:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(299));


/***/ },

/***/ 299:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var SliderComponent = (function () {
	    function SliderComponent(el) {
	        this.onChange = new core_1.EventEmitter();
	        this.onFinish = new core_1.EventEmitter();
	        this.el = el;
	    }
	    SliderComponent.prototype.ngOnInit = function () {
	        var _this = this;
	        var rangesliderEl = this.el.nativeElement;
	        this.options['onFinish'] = function (data) {
	            _this.onFinish.next({
	                from: data.from,
	                to: data.to
	            });
	        };
	        this.options['onChange'] = function (data) {
	            _this.onChange.next({
	                from: data.from,
	                to: data.to
	            });
	        };
	        jQuery(rangesliderEl).ionRangeSlider(this.options);
	        this.slider = jQuery(rangesliderEl).data('ionRangeSlider');
	    };
	    SliderComponent.prototype.ngOnChanges = function (changes) {
	        if (this.slider && changes.renderSlider) {
	            this.slider.update(this.options);
	        }
	    };
	    SliderComponent.prototype.ngOnDestroy = function () {
	        if (this.slider) {
	            this.slider.destroy();
	        }
	    };
	    __decorate([
	        core_1.Input(), 
	        __metadata('design:type', Object)
	    ], SliderComponent.prototype, "options", void 0);
	    __decorate([
	        core_1.Input(), 
	        __metadata('design:type', Object)
	    ], SliderComponent.prototype, "renderSlider", void 0);
	    __decorate([
	        core_1.Input(), 
	        __metadata('design:type', Object)
	    ], SliderComponent.prototype, "class", void 0);
	    __decorate([
	        core_1.Output(), 
	        __metadata('design:type', core_1.EventEmitter)
	    ], SliderComponent.prototype, "onChange", void 0);
	    __decorate([
	        core_1.Output(), 
	        __metadata('design:type', core_1.EventEmitter)
	    ], SliderComponent.prototype, "onFinish", void 0);
	    SliderComponent = __decorate([
	        core_1.Component({
	            selector: 'prs-range-slider',
	            template: "\n    <input type=\"text\" value=\"\" name=\"range\" class=\"{{class}}\">\n  "
	        }), 
	        __metadata('design:paramtypes', [core_1.ElementRef])
	    ], SliderComponent);
	    return SliderComponent;
	}());
	exports.SliderComponent = SliderComponent;


/***/ },

/***/ 334:
/***/ function(module, exports) {

	/**
	 * jQuery Geocoding and Places Autocomplete Plugin - V 1.6.5
	 *
	 * @author Martin Kleppe <kleppe@ubilabs.net>, 2014
	 * @author Ubilabs http://ubilabs.net, 2014
	 * @license MIT License <http://www.opensource.org/licenses/mit-license.php>
	 */

	// # $.geocomplete()
	// ## jQuery Geocoding and Places Autocomplete Plugin
	//
	// * https://github.com/ubilabs/geocomplete/
	// * by Martin Kleppe <kleppe@ubilabs.net>

	(function($, window, document, undefined){

	  // ## Options
	  // The default options for this plugin.
	  //
	  // * `map` - Might be a selector, an jQuery object or a DOM element. Default is `false` which shows no map.
	  // * `details` - The container that should be populated with data. Defaults to `false` which ignores the setting.
	  // * 'detailsScope' - Allows you to scope the 'details' container and have multiple geocomplete fields on one page. Must be a parent of the input. Default is 'null'
	  // * `location` - Location to initialize the map on. Might be an address `string` or an `array` with [latitude, longitude] or a `google.maps.LatLng`object. Default is `false` which shows a blank map.
	  // * `bounds` - Whether to snap geocode search to map bounds. Default: `true` if false search globally. Alternatively pass a custom `LatLngBounds object.
	  // * `autoselect` - Automatically selects the highlighted item or the first item from the suggestions list on Enter.
	  // * `detailsAttribute` - The attribute's name to use as an indicator. Default: `"name"`
	  // * `mapOptions` - Options to pass to the `google.maps.Map` constructor. See the full list [here](http://code.google.com/apis/maps/documentation/javascript/reference.html#MapOptions).
	  // * `mapOptions.zoom` - The inital zoom level. Default: `14`
	  // * `mapOptions.scrollwheel` - Whether to enable the scrollwheel to zoom the map. Default: `false`
	  // * `mapOptions.mapTypeId` - The map type. Default: `"roadmap"`
	  // * `markerOptions` - The options to pass to the `google.maps.Marker` constructor. See the full list [here](http://code.google.com/apis/maps/documentation/javascript/reference.html#MarkerOptions).
	  // * `markerOptions.draggable` - If the marker is draggable. Default: `false`. Set to true to enable dragging.
	  // * `markerOptions.disabled` - Do not show marker. Default: `false`. Set to true to disable marker.
	  // * `maxZoom` - The maximum zoom level too zoom in after a geocoding response. Default: `16`
	  // * `types` - An array containing one or more of the supported types for the places request. Default: `['geocode']` See the full list [here](http://code.google.com/apis/maps/documentation/javascript/places.html#place_search_requests).
	  // * `blur` - Trigger geocode when input loses focus.
	  // * `geocodeAfterResult` - If blur is set to true, choose whether to geocode if user has explicitly selected a result before blur.
	  // * `restoreValueAfterBlur` - Restores the input's value upon blurring. Default is `false` which ignores the setting.

	  var defaults = {
	    bounds: true,
	    country: null,
	    map: false,
	    details: false,
	    detailsAttribute: "name",
	    detailsScope: null,
	    autoselect: true,
	    location: false,

	    mapOptions: {
	      zoom: 14,
	      scrollwheel: false,
	      mapTypeId: "roadmap"
	    },

	    markerOptions: {
	      draggable: false
	    },

	    maxZoom: 16,
	    types: ['geocode'],
	    blur: false,
	    geocodeAfterResult: false,
	    restoreValueAfterBlur: false
	  };

	  // See: [Geocoding Types](https://developers.google.com/maps/documentation/geocoding/#Types)
	  // on Google Developers.
	  var componentTypes = ("street_address route intersection political " +
	    "country administrative_area_level_1 administrative_area_level_2 " +
	    "administrative_area_level_3 colloquial_area locality sublocality " +
	    "neighborhood premise subpremise postal_code natural_feature airport " +
	    "park point_of_interest post_box street_number floor room " +
	    "lat lng viewport location " +
	    "formatted_address location_type bounds").split(" ");

	  // See: [Places Details Responses](https://developers.google.com/maps/documentation/javascript/places#place_details_responses)
	  // on Google Developers.
	  var placesDetails = ("id place_id url website vicinity reference name rating " +
	    "international_phone_number icon formatted_phone_number").split(" ");

	  // The actual plugin constructor.
	  function GeoComplete(input, options) {

	    this.options = $.extend(true, {}, defaults, options);

	    this.input = input;
	    this.$input = $(input);

	    this._defaults = defaults;
	    this._name = 'geocomplete';

	    this.init();
	  }

	  // Initialize all parts of the plugin.
	  $.extend(GeoComplete.prototype, {
	    init: function(){
	      this.initMap();
	      this.initMarker();
	      this.initGeocoder();
	      this.initDetails();
	      this.initLocation();
	    },

	    // Initialize the map but only if the option `map` was set.
	    // This will create a `map` within the given container
	    // using the provided `mapOptions` or link to the existing map instance.
	    initMap: function(){
	      if (!this.options.map){ return; }

	      if (typeof this.options.map.setCenter == "function"){
	        this.map = this.options.map;
	        return;
	      }

	      this.map = new google.maps.Map(
	        $(this.options.map)[0],
	        this.options.mapOptions
	      );

	      // add click event listener on the map
	      google.maps.event.addListener(
	        this.map,
	        'click',
	        $.proxy(this.mapClicked, this)
	      );
	 
	      // add dragend even listener on the map
	      google.maps.event.addListener(
	        this.map,
	        'dragend',
	        $.proxy(this.mapDragged, this)
	      );
	      
	      // add idle even listener on the map
	      google.maps.event.addListener(
	        this.map,
	        'idle',
	        $.proxy(this.mapIdle, this)
	      );

	      google.maps.event.addListener(
	        this.map,
	        'zoom_changed',
	        $.proxy(this.mapZoomed, this)
	      );
	    },

	    // Add a marker with the provided `markerOptions` but only
	    // if the option was set. Additionally it listens for the `dragend` event
	    // to notify the plugin about changes.
	    initMarker: function(){
	      if (!this.map){ return; }
	      var options = $.extend(this.options.markerOptions, { map: this.map });

	      if (options.disabled){ return; }

	      this.marker = new google.maps.Marker(options);

	      google.maps.event.addListener(
	        this.marker,
	        'dragend',
	        $.proxy(this.markerDragged, this)
	      );
	    },

	    // Associate the input with the autocompleter and create a geocoder
	    // to fall back when the autocompleter does not return a value.
	    initGeocoder: function(){

	      // Indicates is user did select a result from the dropdown.
	      var selected = false;

	      var options = {
	        types: this.options.types,
	        bounds: this.options.bounds === true ? null : this.options.bounds,
	        componentRestrictions: this.options.componentRestrictions
	      };

	      if (this.options.country){
	        options.componentRestrictions = {country: this.options.country};
	      }

	      this.autocomplete = new google.maps.places.Autocomplete(
	        this.input, options
	      );

	      this.geocoder = new google.maps.Geocoder();

	      // Bind autocomplete to map bounds but only if there is a map
	      // and `options.bindToMap` is set to true.
	      if (this.map && this.options.bounds === true){
	        this.autocomplete.bindTo('bounds', this.map);
	      }

	      // Watch `place_changed` events on the autocomplete input field.
	      google.maps.event.addListener(
	        this.autocomplete,
	        'place_changed',
	        $.proxy(this.placeChanged, this)
	      );

	      // Prevent parent form from being submitted if user hit enter.
	      this.$input.on('keypress.' + this._name, function(event){
	        if (event.keyCode === 13){ return false; }
	      });

	      // Assume that if user types anything after having selected a result,
	      // the selected location is not valid any more.
	      if (this.options.geocodeAfterResult === true){
	        this.$input.bind('keypress.' + this._name, $.proxy(function(){
	          if (event.keyCode != 9 && this.selected === true){
	              this.selected = false;
	          }
	        }, this));
	      }

	      // Listen for "geocode" events and trigger find action.
	      this.$input.bind('geocode.' + this._name, $.proxy(function(){
	        this.find();
	      }, this));

	      // Saves the previous input value
	      this.$input.bind('geocode:result.' + this._name, $.proxy(function(){
	        this.lastInputVal = this.$input.val();
	      }, this));

	      // Trigger find action when input element is blurred out and user has
	      // not explicitly selected a result.
	      // (Useful for typing partial location and tabbing to the next field
	      // or clicking somewhere else.)
	      if (this.options.blur === true){
	        this.$input.on('blur.' + this._name, $.proxy(function(){
	          if (this.options.geocodeAfterResult === true && this.selected === true) { return; }

	          if (this.options.restoreValueAfterBlur === true && this.selected === true) {
	            setTimeout($.proxy(this.restoreLastValue, this), 0);
	          } else {
	            this.find();
	          }
	        }, this));
	      }
	    },

	    // Prepare a given DOM structure to be populated when we got some data.
	    // This will cycle through the list of component types and map the
	    // corresponding elements.
	    initDetails: function(){
	      if (!this.options.details){ return; }

	      if(this.options.detailsScope) {
	        var $details = $(this.input).parents(this.options.detailsScope).find(this.options.details);
	      } else {
	        var $details = $(this.options.details);
	      }

	      var attribute = this.options.detailsAttribute,
	        details = {};

	      function setDetail(value){
	        details[value] = $details.find("[" +  attribute + "=" + value + "]");
	      }

	      $.each(componentTypes, function(index, key){
	        setDetail(key);
	        setDetail(key + "_short");
	      });

	      $.each(placesDetails, function(index, key){
	        setDetail(key);
	      });

	      this.$details = $details;
	      this.details = details;
	    },

	    // Set the initial location of the plugin if the `location` options was set.
	    // This method will care about converting the value into the right format.
	    initLocation: function() {

	      var location = this.options.location, latLng;

	      if (!location) { return; }

	      if (typeof location == 'string') {
	        this.find(location);
	        return;
	      }

	      if (location instanceof Array) {
	        latLng = new google.maps.LatLng(location[0], location[1]);
	      }

	      if (location instanceof google.maps.LatLng){
	        latLng = location;
	      }

	      if (latLng){
	        if (this.map){ this.map.setCenter(latLng); }
	        if (this.marker){ this.marker.setPosition(latLng); }
	      }
	    },

	    destroy: function(){
	      if (this.map) {
	        google.maps.event.clearInstanceListeners(this.map);
	        google.maps.event.clearInstanceListeners(this.marker);
	      }

	      this.autocomplete.unbindAll();
	      google.maps.event.clearInstanceListeners(this.autocomplete);
	      google.maps.event.clearInstanceListeners(this.input);
	      this.$input.removeData();
	      this.$input.off(this._name);
	      this.$input.unbind('.' + this._name);
	    },

	    // Look up a given address. If no `address` was specified it uses
	    // the current value of the input.
	    find: function(address){
	      this.geocode({
	        address: address || this.$input.val()
	      });
	    },

	    // Requests details about a given location.
	    // Additionally it will bias the requests to the provided bounds.
	    geocode: function(request){
	      // Don't geocode if the requested address is empty
	      if (!request.address) {
	        return;
	      }
	      if (this.options.bounds && !request.bounds){
	        if (this.options.bounds === true){
	          request.bounds = this.map && this.map.getBounds();
	        } else {
	          request.bounds = this.options.bounds;
	        }
	      }

	      if (this.options.country){
	        request.region = this.options.country;
	      }

	      this.geocoder.geocode(request, $.proxy(this.handleGeocode, this));
	    },

	    // Get the selected result. If no result is selected on the list, then get
	    // the first result from the list.
	    selectFirstResult: function() {
	      //$(".pac-container").hide();

	      var selected = '';
	      // Check if any result is selected.
	      if ($(".pac-item-selected")[0]) {
	        selected = '-selected';
	      }

	      // Get the first suggestion's text.
	      var $span1 = $(".pac-container:last .pac-item" + selected + ":first span:nth-child(2)").text();
	      var $span2 = $(".pac-container:last .pac-item" + selected + ":first span:nth-child(3)").text();

	      // Adds the additional information, if available.
	      var firstResult = $span1;
	      if ($span2) {
	        firstResult += " - " + $span2;
	      }

	      this.$input.val(firstResult);

	      return firstResult;
	    },

	    // Restores the input value using the previous value if it exists
	    restoreLastValue: function() {
	      if (this.lastInputVal){ this.$input.val(this.lastInputVal); }
	    },

	    // Handles the geocode response. If more than one results was found
	    // it triggers the "geocode:multiple" events. If there was an error
	    // the "geocode:error" event is fired.
	    handleGeocode: function(results, status){
	      if (status === google.maps.GeocoderStatus.OK) {
	        var result = results[0];
	        this.$input.val(result.formatted_address);
	        this.update(result);

	        if (results.length > 1){
	          this.trigger("geocode:multiple", results);
	        }

	      } else {
	        this.trigger("geocode:error", status);
	      }
	    },

	    // Triggers a given `event` with optional `arguments` on the input.
	    trigger: function(event, argument){
	      this.$input.trigger(event, [argument]);
	    },

	    // Set the map to a new center by passing a `geometry`.
	    // If the geometry has a viewport, the map zooms out to fit the bounds.
	    // Additionally it updates the marker position.
	    center: function(geometry){
	      if (geometry.viewport){
	        this.map.fitBounds(geometry.viewport);
	        if (this.map.getZoom() > this.options.maxZoom){
	          this.map.setZoom(this.options.maxZoom);
	        }
	      } else {
	        this.map.setZoom(this.options.maxZoom);
	        this.map.setCenter(geometry.location);
	      }

	      if (this.marker){
	        this.marker.setPosition(geometry.location);
	        this.marker.setAnimation(this.options.markerOptions.animation);
	      }
	    },

	    // Update the elements based on a single places or geocoding response
	    // and trigger the "geocode:result" event on the input.
	    update: function(result){

	      if (this.map){
	        this.center(result.geometry);
	      }

	      if (this.$details){
	        this.fillDetails(result);
	      }

	      this.trigger("geocode:result", result);
	    },

	    // Populate the provided elements with new `result` data.
	    // This will lookup all elements that has an attribute with the given
	    // component type.
	    fillDetails: function(result){

	      var data = {},
	        geometry = result.geometry,
	        viewport = geometry.viewport,
	        bounds = geometry.bounds;

	      // Create a simplified version of the address components.
	      $.each(result.address_components, function(index, object){
	        var name = object.types[0];

	        $.each(object.types, function(index, name){
	          data[name] = object.long_name;
	          data[name + "_short"] = object.short_name;
	        });
	      });

	      // Add properties of the places details.
	      $.each(placesDetails, function(index, key){
	        data[key] = result[key];
	      });

	      // Add infos about the address and geometry.
	      $.extend(data, {
	        formatted_address: result.formatted_address,
	        location_type: geometry.location_type || "PLACES",
	        viewport: viewport,
	        bounds: bounds,
	        location: geometry.location,
	        lat: geometry.location.lat(),
	        lng: geometry.location.lng()
	      });

	      // Set the values for all details.
	      $.each(this.details, $.proxy(function(key, $detail){
	        var value = data[key];
	        this.setDetail($detail, value);
	      }, this));

	      this.data = data;
	    },

	    // Assign a given `value` to a single `$element`.
	    // If the element is an input, the value is set, otherwise it updates
	    // the text content.
	    setDetail: function($element, value){

	      if (value === undefined){
	        value = "";
	      } else if (typeof value.toUrlValue == "function"){
	        value = value.toUrlValue();
	      }

	      if ($element.is(":input")){
	        $element.val(value);
	      } else {
	        $element.text(value);
	      }
	    },

	    // Fire the "geocode:dragged" event and pass the new position.
	    markerDragged: function(event){
	      this.trigger("geocode:dragged", event.latLng);
	    },

	    mapClicked: function(event) {
	        this.trigger("geocode:click", event.latLng);
	    },
	   
	    // Fire the "geocode:mapdragged" event and pass the current position of the map center.
	    mapDragged: function(event) {
	      this.trigger("geocode:mapdragged", this.map.getCenter());
	    },

	    // Fire the "geocode:idle" event and pass the current position of the map center.
	    mapIdle: function(event) {
	      this.trigger("geocode:idle", this.map.getCenter());
	    },

	    mapZoomed: function(event) {
	      this.trigger("geocode:zoom", this.map.getZoom());
	    },

	    // Restore the old position of the marker to the last knwon location.
	    resetMarker: function(){
	      this.marker.setPosition(this.data.location);
	      this.setDetail(this.details.lat, this.data.location.lat());
	      this.setDetail(this.details.lng, this.data.location.lng());
	    },

	    // Update the plugin after the user has selected an autocomplete entry.
	    // If the place has no geometry it passes it to the geocoder.
	    placeChanged: function(){
	      var place = this.autocomplete.getPlace();
	      this.selected = true;

	      if (!place.geometry){
	        if (this.options.autoselect) {
	          // Automatically selects the highlighted item or the first item from the
	          // suggestions list.
	          var autoSelection = this.selectFirstResult();
	          this.find(autoSelection);
	        }
	      } else {
	        // Use the input text if it already gives geometry.
	        this.update(place);
	      }
	    }
	  });

	  // A plugin wrapper around the constructor.
	  // Pass `options` with all settings that are different from the default.
	  // The attribute is used to prevent multiple instantiations of the plugin.
	  $.fn.geocomplete = function(options) {

	    var attribute = 'plugin_geocomplete';

	    // If you call `.geocomplete()` with a string as the first parameter
	    // it returns the corresponding property or calls the method with the
	    // following arguments.
	    if (typeof options == "string"){

	      var instance = $(this).data(attribute) || $(this).geocomplete().data(attribute),
	        prop = instance[options];

	      if (typeof prop == "function"){
	        prop.apply(instance, Array.prototype.slice.call(arguments, 1));
	        return $(this);
	      } else {
	        if (arguments.length == 2){
	          prop = arguments[1];
	        }
	        return prop;
	      }
	    } else {
	      return this.each(function() {
	        // Prevent against multiple instantiations.
	        var instance = $.data(this, attribute);
	        if (!instance) {
	          instance = new GeoComplete( this, options );
	          $.data(this, attribute, instance);
	        }
	      });
	    }
	  };

	})( jQuery, window, document );


/***/ },

/***/ 430:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(738));


/***/ },

/***/ 431:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(741));


/***/ },

/***/ 720:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var common_1 = __webpack_require__(36);
	var browser_adapter_1 = __webpack_require__(78);
	var router_deprecated_1 = __webpack_require__(12);
	var directives_1 = __webpack_require__(744);
	var navigation_1 = __webpack_require__(732);
	var crowd_1 = __webpack_require__(724);
	var page_title_1 = __webpack_require__(734);
	var services_1 = __webpack_require__(8);
	var services_2 = __webpack_require__(168);
	var user_profile_1 = __webpack_require__(264);
	var connections_1 = __webpack_require__(722);
	var settings_1 = __webpack_require__(736);
	var events_1 = __webpack_require__(726);
	var messages_1 = __webpack_require__(728);
	var my_profile_1 = __webpack_require__(730);
	var PAGES_WITH_FILTER = ['crowd', 'connections'];
	/*
	 * Persice App Component
	 * Top Level Component
	 */
	var AppMobileComponent = (function () {
	    function AppMobileComponent(_appStateService, _router) {
	        this._appStateService = _appStateService;
	        this._router = _router;
	        this.isHeaderVisible = true;
	        this.isFooterVisible = false;
	        this.pagesWithFilter = PAGES_WITH_FILTER;
	        this.pageTitle = 'Persice';
	        this.footerScore = 0;
	    }
	    AppMobileComponent.prototype.ngOnInit = function () {
	        var _this = this;
	        // Subscribe to EventEmmitter from AppStateService to show or hide main app header
	        this._appStateService.isHeaderVisibleEmitter
	            .subscribe(function (visibility) {
	            _this.isHeaderVisible = visibility;
	        });
	        this._appStateService.isHeaderVisibleEmitter
	            .subscribe(function (visibility) {
	            _this.isHeaderVisible = visibility;
	        });
	        this._appStateService.isProfileFooterVisibleEmitter
	            .subscribe(function (state) {
	            _this.isFooterVisible = state.visibility;
	            _this.footerScore = state.score ? state.score : 0;
	            _this.footerType = state.type ? state.type : '';
	            _this.footerUserId = state.userId ? state.userId : null;
	        });
	        this._router.subscribe(function (next) {
	            _this._onRouteChange(next);
	        });
	    };
	    /**
	     * Set Filter page visible using app state service
	     */
	    AppMobileComponent.prototype.setFilterVisible = function () {
	        this._appStateService.setFilterVisibility(true);
	        this._appStateService.setHeaderVisibility(false);
	    };
	    /**
	     * Emit accept or pass state for friendship on crowd page
	     * @param {Object} event {userid: number, state: [-1|0]}
	     */
	    AppMobileComponent.prototype.setFriendshipStatus = function (event) {
	        this._appStateService.setFriendshipStatus(event);
	    };
	    /**
	     * Change page title in top header when route changes
	     * @param {string} next [description]
	     */
	    AppMobileComponent.prototype._onRouteChange = function (next) {
	        this.pageTitle = next;
	    };
	    AppMobileComponent = __decorate([
	        router_deprecated_1.RouteConfig([
	            {
	                path: '/',
	                redirectTo: ['Crowd']
	            },
	            {
	                path: '/crowd',
	                component: crowd_1.CrowdMobileComponent,
	                name: 'Crowd',
	                useAsDefault: true
	            },
	            {
	                path: '/connections',
	                component: connections_1.ConnectionsMobileComponent,
	                name: 'Connections'
	            },
	            {
	                path: '/settings',
	                component: settings_1.SettingsMobileComponent,
	                name: 'Settings'
	            },
	            {
	                path: '/events',
	                component: events_1.EventsMobileComponent,
	                name: 'Events'
	            },
	            {
	                path: '/messages',
	                component: messages_1.MessagesMobileComponent,
	                name: 'Messages'
	            },
	            {
	                path: '/my-profile',
	                component: my_profile_1.MyProfileMobileComponent,
	                name: 'MyProfile'
	            },
	        ]),
	        core_1.Component({
	            selector: 'persice-mobile-app',
	            template: __webpack_require__(874),
	            providers: [
	                browser_adapter_1.BrowserDomAdapter,
	                services_1.FilterService,
	                services_2.AppStateService
	            ],
	            directives: [
	                common_1.CORE_DIRECTIVES,
	                common_1.FORM_DIRECTIVES,
	                router_deprecated_1.ROUTER_DIRECTIVES,
	                navigation_1.NavigationMobileComponent,
	                directives_1.OpenLeftMenuDirective,
	                directives_1.CloseLeftMenuDirective,
	                directives_1.IfRoutesActiveDirective,
	                page_title_1.PageTitleComponent,
	                user_profile_1.ProfileFooterMobileComponent
	            ],
	            encapsulation: core_1.ViewEncapsulation.None
	        }), 
	        __metadata('design:paramtypes', [services_2.AppStateService, router_deprecated_1.Router])
	    ], AppMobileComponent);
	    return AppMobileComponent;
	}());
	exports.AppMobileComponent = AppMobileComponent;


/***/ },

/***/ 721:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var services_1 = __webpack_require__(8);
	var connections_1 = __webpack_require__(180);
	var filter_1 = __webpack_require__(430);
	var user_card_1 = __webpack_require__(431);
	var loading_1 = __webpack_require__(17);
	var services_2 = __webpack_require__(168);
	var directives_1 = __webpack_require__(134);
	var user_profile_1 = __webpack_require__(264);
	var LIST_REFRESH_TIMEOUT = 0;
	var ConnectionsMobileComponent = (function (_super) {
	    __extends(ConnectionsMobileComponent, _super);
	    function ConnectionsMobileComponent(listService, filterService, appStateService) {
	        _super.call(this, listService, filterService, LIST_REFRESH_TIMEOUT);
	        this.listService = listService;
	        this.filterService = filterService;
	        this.appStateService = appStateService;
	        this.isFilterVisible = false;
	    }
	    ConnectionsMobileComponent.prototype.ngOnInit = function () {
	        var _this = this;
	        this.getList();
	        this.subscribeToFilterServiceUpdates();
	        // Control filter visibility
	        this.appStateService.isFilterVisibleEmitter
	            .subscribe(function (visibility) {
	            _this.isFilterVisible = visibility;
	        });
	    };
	    ConnectionsMobileComponent.prototype.ngOnDestroy = function () {
	        this.clearServicesSubscriptions();
	    };
	    ConnectionsMobileComponent.prototype.beforeItemSelected = function () {
	        this.saveScrollPosition();
	    };
	    ConnectionsMobileComponent.prototype.afterItemSelected = function () {
	        // Hide profile header
	        this.appStateService.setHeaderVisibility(false);
	        // Show profile footer visibility
	        this.appStateService.setProfileFooterVisibility({
	            visibility: true,
	            type: 'connection'
	        });
	    };
	    ConnectionsMobileComponent.prototype.afterItemClosed = function () {
	        // Show top header
	        this.appStateService.setHeaderVisibility(true);
	        // Hide profile footer
	        this.appStateService.setProfileFooterVisibility({
	            visibility: false
	        });
	        this.restoreScrollPosition();
	    };
	    ConnectionsMobileComponent = __decorate([
	        core_1.Component({
	            selector: 'prs-mobile-connections',
	            template: __webpack_require__(875),
	            providers: [connections_1.ConnectionsService],
	            directives: [
	                loading_1.LoadingComponent,
	                user_card_1.UserCardMobileComponent,
	                filter_1.FilterMobileComponent,
	                directives_1.InfiniteScrollDirective,
	                user_profile_1.UserProfileComponent
	            ]
	        }), 
	        __metadata('design:paramtypes', [connections_1.ConnectionsService, services_1.FilterService, services_2.AppStateService])
	    ], ConnectionsMobileComponent);
	    return ConnectionsMobileComponent;
	}(connections_1.ConnectionsComponent));
	exports.ConnectionsMobileComponent = ConnectionsMobileComponent;


/***/ },

/***/ 722:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(721));


/***/ },

/***/ 723:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var crowd_1 = __webpack_require__(181);
	var crowd_2 = __webpack_require__(181);
	var filter_1 = __webpack_require__(430);
	var user_card_1 = __webpack_require__(431);
	var loading_1 = __webpack_require__(17);
	var services_1 = __webpack_require__(8);
	var services_2 = __webpack_require__(168);
	var directives_1 = __webpack_require__(134);
	var user_profile_1 = __webpack_require__(264);
	var LIST_REFRESH_TIMEOUT = 0;
	var CrowdMobileComponent = (function (_super) {
	    __extends(CrowdMobileComponent, _super);
	    function CrowdMobileComponent(listService, friendService, filterService, appStateService) {
	        _super.call(this, listService, friendService, filterService, LIST_REFRESH_TIMEOUT);
	        this.listService = listService;
	        this.friendService = friendService;
	        this.filterService = filterService;
	        this.appStateService = appStateService;
	        this.isFilterVisible = false;
	    }
	    CrowdMobileComponent.prototype.ngOnInit = function () {
	        var _this = this;
	        this.getList();
	        this.subscribeToFilterServiceUpdates();
	        // Control filter visibility
	        this.isFilterVisibleEmitterInstance = this.appStateService.isFilterVisibleEmitter
	            .subscribe(function (visibility) {
	            _this.isFilterVisible = visibility;
	        });
	        // Subscribe to appStateService acceptPassEmitter
	        // for knowing when to update friendship status via accept() or pass() methods
	        this.acceptPassEmitterInstance = this.appStateService.acceptPassEmitter
	            .subscribe(function (state) {
	            _this._saveFriendshipStatus(state);
	        });
	    };
	    CrowdMobileComponent.prototype.ngOnDestroy = function () {
	        this.clearServicesSubscriptions();
	        // Unsubscribe from appStateService Emitters
	        this.isFilterVisibleEmitterInstance.unsubscribe();
	        this.acceptPassEmitterInstance.unsubscribe();
	    };
	    CrowdMobileComponent.prototype.beforeItemSelected = function () {
	        this.saveScrollPosition();
	        // TODO: think how to solve hiding intercom without using jQuery
	        // This is a temporary workaround to hide intercom icon when opening profile page
	        jQuery('#intercom-launcher').css('display', 'none');
	    };
	    CrowdMobileComponent.prototype.afterItemSelected = function () {
	        // Hide profile header.
	        this.appStateService.setHeaderVisibility(false);
	        // Show profile footer visibility.
	        this.appStateService.setProfileFooterVisibility({
	            visibility: true,
	            score: this.selectedItem.score,
	            userId: this.selectedItem.id,
	            type: 'crowd'
	        });
	    };
	    CrowdMobileComponent.prototype.afterItemClosed = function () {
	        // Show top header.
	        this.appStateService.setHeaderVisibility(true);
	        // Hide profile footer.
	        this.appStateService.setProfileFooterVisibility({
	            visibility: false
	        });
	        this.restoreScrollPosition();
	        // TODO: think how to solve showing intercom without using jQuery
	        // This is a temporary workaround to show intercom icon after profile page is closed
	        jQuery('#intercom-launcher').css('display', 'block');
	    };
	    CrowdMobileComponent.prototype._saveFriendshipStatus = function (state) {
	        var _this = this;
	        // Remove user from feed after friendship status is changed.
	        this.removeItemById(state.userId);
	        // When state.userId is equal to selected user's id attribute (selectedItem.id),
	        // save new friendship state.
	        if (this.selectedItem.id === state.userId) {
	            this.friendService.saveFriendship(state.status, state.userId)
	                .subscribe(function (data) {
	                _this.closeItemView(null);
	            }, function (err) {
	                _this.closeItemView(null);
	            });
	        }
	    };
	    CrowdMobileComponent = __decorate([
	        core_1.Component({
	            selector: 'prs-mobile-crowd',
	            template: __webpack_require__(876),
	            providers: [crowd_1.CrowdService, services_1.FriendService],
	            directives: [
	                loading_1.LoadingComponent,
	                user_card_1.UserCardMobileComponent,
	                filter_1.FilterMobileComponent,
	                directives_1.InfiniteScrollDirective,
	                user_profile_1.UserProfileComponent
	            ]
	        }), 
	        __metadata('design:paramtypes', [crowd_1.CrowdService, services_1.FriendService, services_1.FilterService, services_2.AppStateService])
	    ], CrowdMobileComponent);
	    return CrowdMobileComponent;
	}(crowd_2.CrowdComponent));
	exports.CrowdMobileComponent = CrowdMobileComponent;


/***/ },

/***/ 724:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(723));


/***/ },

/***/ 725:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var EventsMobileComponent = (function () {
	    function EventsMobileComponent() {
	    }
	    EventsMobileComponent = __decorate([
	        core_1.Component({
	            selector: 'prs-mobile-events',
	            template: __webpack_require__(877)
	        }), 
	        __metadata('design:paramtypes', [])
	    ], EventsMobileComponent);
	    return EventsMobileComponent;
	}());
	exports.EventsMobileComponent = EventsMobileComponent;


/***/ },

/***/ 726:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(725));


/***/ },

/***/ 727:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	// App
	__export(__webpack_require__(720));
	var core_1 = __webpack_require__(175);
	// import {provideStore} from '@ngrx/store';
	// import * as devtools from '@ngrx/devtools';
	__webpack_require__(1325);
	var core_2 = __webpack_require__(5);
	// Application wide providers
	exports.APP_PROVIDERS = core_1.ANGULAR2_GOOGLE_MAPS_PROVIDERS.concat([
	    core_2.HttpClient
	]);


/***/ },

/***/ 728:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(729));


/***/ },

/***/ 729:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var MessagesMobileComponent = (function () {
	    function MessagesMobileComponent() {
	    }
	    MessagesMobileComponent = __decorate([
	        core_1.Component({
	            selector: 'prs-mobile-messages',
	            template: __webpack_require__(878)
	        }), 
	        __metadata('design:paramtypes', [])
	    ], MessagesMobileComponent);
	    return MessagesMobileComponent;
	}());
	exports.MessagesMobileComponent = MessagesMobileComponent;


/***/ },

/***/ 730:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(731));


/***/ },

/***/ 731:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var MyProfileMobileComponent = (function () {
	    function MyProfileMobileComponent() {
	    }
	    MyProfileMobileComponent = __decorate([
	        core_1.Component({
	            selector: 'prs-mobile-my-profile',
	            template: __webpack_require__(879)
	        }), 
	        __metadata('design:paramtypes', [])
	    ], MyProfileMobileComponent);
	    return MyProfileMobileComponent;
	}());
	exports.MyProfileMobileComponent = MyProfileMobileComponent;


/***/ },

/***/ 732:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(733));


/***/ },

/***/ 733:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var router_deprecated_1 = __webpack_require__(12);
	var NavigationMobileComponent = (function () {
	    function NavigationMobileComponent() {
	    }
	    NavigationMobileComponent = __decorate([
	        core_1.Component({
	            selector: 'prs-mobile-navigation',
	            template: __webpack_require__(880),
	            directives: [router_deprecated_1.RouterLink]
	        }), 
	        __metadata('design:paramtypes', [])
	    ], NavigationMobileComponent);
	    return NavigationMobileComponent;
	}());
	exports.NavigationMobileComponent = NavigationMobileComponent;


/***/ },

/***/ 734:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(735));


/***/ },

/***/ 735:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var PageTitleComponent = (function () {
	    function PageTitleComponent() {
	        this.pageTitle = '';
	    }
	    Object.defineProperty(PageTitleComponent.prototype, "title", {
	        set: function (value) {
	            this.pageTitle = value.replace(/-/g, ' '); //replace '-' char with space
	        },
	        enumerable: true,
	        configurable: true
	    });
	    __decorate([
	        core_1.Input(), 
	        __metadata('design:type', String), 
	        __metadata('design:paramtypes', [String])
	    ], PageTitleComponent.prototype, "title", null);
	    PageTitleComponent = __decorate([
	        core_1.Component({
	            selector: 'prs-page-title',
	            template: '<h2 class="mob-header__title">{{pageTitle}}</h2>',
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], PageTitleComponent);
	    return PageTitleComponent;
	}());
	exports.PageTitleComponent = PageTitleComponent;


/***/ },

/***/ 736:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(737));


/***/ },

/***/ 737:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var SettingsMobileComponent = (function () {
	    function SettingsMobileComponent() {
	    }
	    SettingsMobileComponent = __decorate([
	        core_1.Component({
	            selector: 'prs-mobile-settings',
	            template: __webpack_require__(881)
	        }), 
	        __metadata('design:paramtypes', [])
	    ], SettingsMobileComponent);
	    return SettingsMobileComponent;
	}());
	exports.SettingsMobileComponent = SettingsMobileComponent;


/***/ },

/***/ 738:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var filter_1 = __webpack_require__(295);
	var slider_1 = __webpack_require__(298);
	var services_1 = __webpack_require__(8);
	var services_2 = __webpack_require__(168);
	var directives_1 = __webpack_require__(13);
	var pipes_1 = __webpack_require__(108);
	var keywords_mobile_component_1 = __webpack_require__(740);
	var FilterMobileComponent = (function (_super) {
	    __extends(FilterMobileComponent, _super);
	    function FilterMobileComponent(filterService, appStateService) {
	        _super.call(this, filterService);
	        this.filterService = filterService;
	        this.appStateService = appStateService;
	        this.filtersVisible = true;
	        this.keywordsVisible = false;
	    }
	    FilterMobileComponent.prototype.save = function () {
	        delete this.filters.state.keyword;
	        this.filterService
	            .updateOne(this.filters.state.resource_uri, this.filters.state)
	            .subscribe();
	    };
	    FilterMobileComponent.prototype.activateTab = function (type) {
	        switch (type) {
	            case 'filters':
	                this.filtersVisible = true;
	                this.keywordsVisible = false;
	                break;
	            case 'keywords':
	                this.filtersVisible = false;
	                this.keywordsVisible = true;
	                break;
	            default:
	                break;
	        }
	    };
	    FilterMobileComponent.prototype.onBack = function () {
	        this._hideFiltersAndShowMainHeader();
	    };
	    FilterMobileComponent.prototype.onGo = function () {
	        this._hideFiltersAndShowMainHeader();
	        this.filterService.publishObservers();
	    };
	    FilterMobileComponent.prototype._hideFiltersAndShowMainHeader = function () {
	        this.appStateService.setFilterVisibility(false);
	        this.appStateService.setHeaderVisibility(true);
	    };
	    FilterMobileComponent = __decorate([
	        core_1.Component({
	            selector: 'prs-mobile-filter',
	            template: __webpack_require__(882),
	            directives: [directives_1.SelectDirective, slider_1.SliderComponent, keywords_mobile_component_1.KeywordsComponentMobile],
	            pipes: [pipes_1.NumeralPipe]
	        }), 
	        __metadata('design:paramtypes', [services_1.FilterService, services_2.AppStateService])
	    ], FilterMobileComponent);
	    return FilterMobileComponent;
	}(filter_1.FilterComponent));
	exports.FilterMobileComponent = FilterMobileComponent;


/***/ },

/***/ 739:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var person_1 = __webpack_require__(107);
	var InterestsCardMobileComponent = (function () {
	    function InterestsCardMobileComponent() {
	    }
	    Object.defineProperty(InterestsCardMobileComponent.prototype, "person", {
	        set: function (person) {
	            this._person = person;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    ;
	    __decorate([
	        core_1.Input(), 
	        __metadata('design:type', person_1.Person), 
	        __metadata('design:paramtypes', [person_1.Person])
	    ], InterestsCardMobileComponent.prototype, "person", null);
	    InterestsCardMobileComponent = __decorate([
	        core_1.Component({
	            selector: 'prs-mobile-interests-card',
	            template: __webpack_require__(883),
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], InterestsCardMobileComponent);
	    return InterestsCardMobileComponent;
	}());
	exports.InterestsCardMobileComponent = InterestsCardMobileComponent;


/***/ },

/***/ 740:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var models_1 = __webpack_require__(64);
	var services_1 = __webpack_require__(8);
	var KeywordsComponentMobile = (function () {
	    function KeywordsComponentMobile(filterService) {
	        this.filterService = filterService;
	        this.MINIMUM_ITEM_LENGTH = 2;
	        // Maximum allowed length of all items converted to string separated by comma
	        // (e.g. "one,two,three"), including the comma character.
	        this.MAXIMUM_LENGTH_OF_ITEMS = 50;
	        // Collection of items managed by this component.
	        this.items = [];
	        // Label of current item, bound to the input field.
	        this.newItemText = '';
	        // Way to keep track whether filter saving is in progress
	        this.filtersSaving = false;
	        // Way to keep track whether we add item from typeahead or via "Enter" key
	        this.itemBeingAddedFromTypeahead = false;
	        this.itemBeingAddedByEnterKey = false;
	    }
	    KeywordsComponentMobile.prototype.ngAfterViewInit = function () {
	        var _this = this;
	        this.serviceInstance = this.filterService.find()
	            .subscribe(function (data) { return _this.setInitialData(data); });
	    };
	    KeywordsComponentMobile.prototype.ngOnDestroy = function () {
	        this.serviceInstance.unsubscribe();
	    };
	    KeywordsComponentMobile.prototype.setInitialData = function (data) {
	        this.filters = new models_1.FilterModel(data.objects[0]);
	        if (this.filters.state.keyword.length > 0) {
	            this.items = this.filters.state.keyword.split(',');
	        }
	        this.initializeTokenInput();
	    };
	    KeywordsComponentMobile.prototype.initializeTokenInput = function () {
	        var _this = this;
	        var keywordsEngine = new Bloodhound({
	            remote: {
	                url: '/api/v1/interest_subject/?format=json&description__icontains=%QUERY',
	                filter: function (x) {
	                    return jQuery.map(x.objects, function (item) {
	                        return item.description;
	                    });
	                },
	                wildcard: '%QUERY'
	            },
	            datumTokenizer: Bloodhound.tokenizers.whitespace,
	            queryTokenizer: Bloodhound.tokenizers.whitespace
	        });
	        keywordsEngine.initialize();
	        var inputElement = jQuery('#typeaheadInput');
	        inputElement.typeahead({
	            hint: false,
	            highlight: true,
	            minLength: this.MINIMUM_ITEM_LENGTH
	        }, {
	            source: keywordsEngine,
	            limit: 30
	        });
	        inputElement.bind('typeahead:selected', function (ev, suggestion) {
	            _this.newItemText = suggestion;
	            _this.itemBeingAddedFromTypeahead = true;
	            _this.add();
	        });
	    };
	    /**
	     * Parse changes to the input field. If "Enter" was pressed make an attempt to save new item.
	     *
	     * @param event DOM input event.
	     */
	    KeywordsComponentMobile.prototype.inputChanged = function (event) {
	        if (event.which === 13) {
	            if (!this.itemBeingAddedFromTypeahead) {
	                this.add();
	            }
	        }
	        else {
	            this.status = '';
	        }
	    };
	    /**
	     * Add the current item to the item collection and save on the backend.
	     */
	    KeywordsComponentMobile.prototype.add = function () {
	        var item = this.newItemText;
	        if (!this.hasMinimumLength(item)) {
	            this.status = 'failure';
	            return;
	        }
	        if (this.exceedsMaximumLengthOfItems(this.items, item)) {
	            this.status = 'failure';
	            return;
	        }
	        if (this.items.indexOf(item) > -1) {
	            this.status = 'failure';
	            return;
	        }
	        this.items.push(item);
	        this.status = 'success';
	        // Clear typeahead input
	        jQuery('#typeaheadInput').typeahead('val', '');
	        this.save();
	    };
	    /**
	     * Remove the item with a given label from the collection of items and save new collection on the
	     * backend.
	     *
	     * @param item Item to remove.
	     */
	    KeywordsComponentMobile.prototype.remove = function (item) {
	        this.items.splice(this.items.indexOf(item), 1);
	        this.save();
	    };
	    /**
	     * Save all current items on the backend.
	     */
	    KeywordsComponentMobile.prototype.save = function () {
	        this._saveJoinedItems(this.items.join(','));
	    };
	    /**
	     * Perform the actual save.
	     *
	     * @param items Items to save, comma-separated.
	     * @private
	     */
	    KeywordsComponentMobile.prototype._saveJoinedItems = function (items) {
	        var _this = this;
	        if (this.filtersSaving) {
	            return;
	        }
	        this.filtersSaving = true;
	        var data = {
	            keyword: items,
	            user: this.filters.state.user
	        };
	        this.filterService.updateOne(this.filters.state.resource_uri, data)
	            .subscribe(function (res) {
	            _this.newItemText = '';
	            _this.filtersSaving = false;
	            _this.itemBeingAddedByEnterKey = false;
	            _this.itemBeingAddedFromTypeahead = false;
	        }, function (err) {
	            _this.filtersSaving = false;
	            _this.status = 'failure';
	        });
	        this.newItemText = '';
	    };
	    KeywordsComponentMobile.prototype.exceedsMaximumLengthOfItems = function (items, newItem) {
	        return items.concat([newItem]).join(',').length > this.MAXIMUM_LENGTH_OF_ITEMS;
	    };
	    ;
	    KeywordsComponentMobile.prototype.hasMinimumLength = function (item) {
	        return item.length >= this.MINIMUM_ITEM_LENGTH;
	    };
	    ;
	    KeywordsComponentMobile = __decorate([
	        core_1.Component({
	            selector: 'prs-mobile-keywords',
	            template: __webpack_require__(884),
	            providers: [services_1.FilterService]
	        }), 
	        __metadata('design:paramtypes', [services_1.FilterService])
	    ], KeywordsComponentMobile);
	    return KeywordsComponentMobile;
	}());
	exports.KeywordsComponentMobile = KeywordsComponentMobile;


/***/ },

/***/ 741:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var directives_1 = __webpack_require__(13);
	var person_1 = __webpack_require__(107);
	var interests_card_mobile_component_1 = __webpack_require__(739);
	var gender_pipe_ts_1 = __webpack_require__(178);
	var UserCardMobileComponent = (function () {
	    function UserCardMobileComponent() {
	        this.onProfileTap = new core_1.EventEmitter();
	        //Whether top interests drop is visible.
	        this.interestsVisible = false;
	    }
	    Object.defineProperty(UserCardMobileComponent.prototype, "person", {
	        set: function (dto) {
	            this._person = new person_1.Person(dto);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    ;
	    /**
	     * Toggle visibility of top interests
	     * @param {DOM click Event} event
	     */
	    UserCardMobileComponent.prototype.toggleInterestsVisible = function (event) {
	        this.interestsVisible = !this.interestsVisible;
	    };
	    UserCardMobileComponent.prototype.selectPerson = function (event) {
	        this.onProfileTap.emit(this._person.id);
	    };
	    __decorate([
	        core_1.Input(), 
	        __metadata('design:type', Object), 
	        __metadata('design:paramtypes', [Object])
	    ], UserCardMobileComponent.prototype, "person", null);
	    __decorate([
	        core_1.Output(), 
	        __metadata('design:type', core_1.EventEmitter)
	    ], UserCardMobileComponent.prototype, "onProfileTap", void 0);
	    UserCardMobileComponent = __decorate([
	        core_1.Component({
	            selector: 'prs-mobile-user-card',
	            template: __webpack_require__(885),
	            directives: [directives_1.CheckImageDirective, interests_card_mobile_component_1.InterestsCardMobileComponent],
	            pipes: [gender_pipe_ts_1.GenderPipe],
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], UserCardMobileComponent);
	    return UserCardMobileComponent;
	}());
	exports.UserCardMobileComponent = UserCardMobileComponent;


/***/ },

/***/ 742:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var browser_adapter_1 = __webpack_require__(78);
	var router_deprecated_1 = __webpack_require__(12);
	var CloseLeftMenuDirective = (function () {
	    function CloseLeftMenuDirective(_dom, _router) {
	        this._dom = _dom;
	        this._router = _router;
	    }
	    CloseLeftMenuDirective.prototype.onSwipeLeft = function () {
	        this._closeMenu();
	    };
	    CloseLeftMenuDirective.prototype.onTap = function () {
	        this._closeMenu();
	    };
	    CloseLeftMenuDirective.prototype.ngOnInit = function () {
	        var _this = this;
	        this._router.subscribe(function (next) {
	            _this._closeMenu();
	        });
	    };
	    CloseLeftMenuDirective.prototype._closeMenu = function () {
	        this._dom.removeClass(this._dom.query('.container'), 'push-menu-push--toright');
	        this._dom.removeClass(this._dom.query('.content-mask'), 'is-active');
	        this._dom.removeClass(this._dom.query('body'), 'disabled-scrolling');
	        this._dom.removeClass(this._dom.query('#push-menu-s1'), 'is-open');
	    };
	    __decorate([
	        core_1.HostListener('swipeleft'), 
	        __metadata('design:type', Function), 
	        __metadata('design:paramtypes', []), 
	        __metadata('design:returntype', void 0)
	    ], CloseLeftMenuDirective.prototype, "onSwipeLeft", null);
	    __decorate([
	        core_1.HostListener('tap'), 
	        __metadata('design:type', Function), 
	        __metadata('design:paramtypes', []), 
	        __metadata('design:returntype', void 0)
	    ], CloseLeftMenuDirective.prototype, "onTap", null);
	    CloseLeftMenuDirective = __decorate([
	        core_1.Directive({
	            selector: '[prs-close-left-menu]',
	            providers: [browser_adapter_1.BrowserDomAdapter]
	        }), 
	        __metadata('design:paramtypes', [browser_adapter_1.BrowserDomAdapter, router_deprecated_1.Router])
	    ], CloseLeftMenuDirective);
	    return CloseLeftMenuDirective;
	}());
	exports.CloseLeftMenuDirective = CloseLeftMenuDirective;


/***/ },

/***/ 743:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var router_deprecated_1 = __webpack_require__(12);
	var IfRoutesActiveDirective = (function () {
	    function IfRoutesActiveDirective(_router, _viewContainer, _templateRef) {
	        this._router = _router;
	        this._viewContainer = _viewContainer;
	        this._templateRef = _templateRef;
	    }
	    Object.defineProperty(IfRoutesActiveDirective.prototype, "prsIfRoutesActive", {
	        set: function (values) {
	            this._pages = values;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    IfRoutesActiveDirective.prototype.ngOnInit = function () {
	        var _this = this;
	        this._router.subscribe(function (next) {
	            _this._showIfRoutesAreActive(next, _this._pages);
	        });
	    };
	    IfRoutesActiveDirective.prototype._showIfRoutesAreActive = function (current, list) {
	        if (list.indexOf(current) > -1) {
	            this._viewContainer.clear();
	            this._viewContainer.createEmbeddedView(this._templateRef);
	        }
	        else {
	            this._viewContainer.clear();
	        }
	    };
	    __decorate([
	        core_1.Input(), 
	        __metadata('design:type', Array), 
	        __metadata('design:paramtypes', [Array])
	    ], IfRoutesActiveDirective.prototype, "prsIfRoutesActive", null);
	    IfRoutesActiveDirective = __decorate([
	        core_1.Directive({
	            selector: '[prsIfRoutesActive]'
	        }), 
	        __metadata('design:paramtypes', [router_deprecated_1.Router, core_1.ViewContainerRef, core_1.TemplateRef])
	    ], IfRoutesActiveDirective);
	    return IfRoutesActiveDirective;
	}());
	exports.IfRoutesActiveDirective = IfRoutesActiveDirective;


/***/ },

/***/ 744:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(745));
	__export(__webpack_require__(742));
	__export(__webpack_require__(743));


/***/ },

/***/ 745:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var browser_adapter_1 = __webpack_require__(78);
	var OpenLeftMenuDirective = (function () {
	    function OpenLeftMenuDirective(_dom) {
	        this._dom = _dom;
	    }
	    OpenLeftMenuDirective.prototype.onTap = function () {
	        this._triggerMenu();
	    };
	    OpenLeftMenuDirective.prototype._triggerMenu = function () {
	        if (this._dom.hasClass(this._dom.query('.container'), 'push-menu-push--toright')) {
	            this._dom.removeClass(this._dom.query('.container'), 'push-menu-push--toright');
	            this._dom.removeClass(this._dom.query('.content-mask'), 'is-active');
	            this._dom.removeClass(this._dom.query('body'), 'disabled-scrolling');
	            this._dom.removeClass(this._dom.query('.push-menu--left'), 'is-open');
	        }
	        else {
	            this._dom.addClass(this._dom.query('.push-menu--left'), 'is-open');
	            this._dom.addClass(this._dom.query('.container'), 'push-menu-push--toright');
	            this._dom.addClass(this._dom.query('body'), 'disabled-scrolling');
	            this._dom.addClass(this._dom.query('.content-mask'), 'is-active');
	        }
	    };
	    __decorate([
	        core_1.HostListener('tap'), 
	        __metadata('design:type', Function), 
	        __metadata('design:paramtypes', []), 
	        __metadata('design:returntype', void 0)
	    ], OpenLeftMenuDirective.prototype, "onTap", null);
	    OpenLeftMenuDirective = __decorate([
	        core_1.Directive({
	            selector: '[prs-open-left-menu]',
	            providers: [browser_adapter_1.BrowserDomAdapter]
	        }), 
	        __metadata('design:paramtypes', [browser_adapter_1.BrowserDomAdapter])
	    ], OpenLeftMenuDirective);
	    return OpenLeftMenuDirective;
	}());
	exports.OpenLeftMenuDirective = OpenLeftMenuDirective;


/***/ },

/***/ 746:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(107));


/***/ },

/***/ 747:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var AppStateService = (function () {
	    function AppStateService() {
	        this.isHeaderVisibleEmitter = new core_1.EventEmitter();
	        this.isFilterVisibleEmitter = new core_1.EventEmitter();
	        this.isProfileFooterVisibleEmitter = new core_1.EventEmitter();
	        this.acceptPassEmitter = new core_1.EventEmitter();
	    }
	    AppStateService.prototype.setHeaderVisibility = function (visible) {
	        this.isHeaderVisibleEmitter.emit(visible);
	    };
	    AppStateService.prototype.setFriendshipStatus = function (state) {
	        this.acceptPassEmitter.emit(state);
	    };
	    AppStateService.prototype.setFilterVisibility = function (visible) {
	        this.isFilterVisibleEmitter.emit(visible);
	    };
	    AppStateService.prototype.setProfileFooterVisibility = function (state) {
	        this.isProfileFooterVisibleEmitter.emit(state);
	    };
	    AppStateService = __decorate([
	        core_1.Injectable(), 
	        __metadata('design:paramtypes', [])
	    ], AppStateService);
	    return AppStateService;
	}());
	exports.AppStateService = AppStateService;
	exports.appsTateServiceInjectables = [
	    core_1.provide(AppStateService, { useClass: AppStateService })
	];


/***/ },

/***/ 748:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var SHOW_CHAR_LIMIT = 80;
	var AboutMobileComponent = (function () {
	    function AboutMobileComponent() {
	        // About me less and more contents
	        this.aboutLess = '';
	        this.aboutMore = '';
	        // Flag for showing more about me
	        this.showMore = false;
	    }
	    Object.defineProperty(AboutMobileComponent.prototype, "about", {
	        set: function (value) {
	            this._setValue(value);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    AboutMobileComponent.prototype.toggleMore = function (value) {
	        this.showMore = value;
	    };
	    AboutMobileComponent.prototype._setValue = function (value) {
	        var contents = value !== null ? value : '';
	        if (contents.length > SHOW_CHAR_LIMIT) {
	            this.aboutLess = contents.substring(0, SHOW_CHAR_LIMIT);
	            this.aboutMore = contents.substring(SHOW_CHAR_LIMIT, contents.length).trim();
	        }
	        else {
	            this.aboutLess = contents;
	        }
	    };
	    __decorate([
	        core_1.Input(), 
	        __metadata('design:type', String), 
	        __metadata('design:paramtypes', [String])
	    ], AboutMobileComponent.prototype, "about", null);
	    AboutMobileComponent = __decorate([
	        core_1.Component({
	            selector: 'prs-mobile-profile-about-me',
	            template: __webpack_require__(886),
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], AboutMobileComponent);
	    return AboutMobileComponent;
	}());
	exports.AboutMobileComponent = AboutMobileComponent;


/***/ },

/***/ 749:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var directives_1 = __webpack_require__(13);
	var ConnectionsListMobileComponent = (function () {
	    function ConnectionsListMobileComponent() {
	        // Counter for total number of all connections
	        this.connectionsCount = 0;
	        // Indicator for is more button visible
	        this.moreVisible = false;
	    }
	    Object.defineProperty(ConnectionsListMobileComponent.prototype, "items", {
	        // When [items] from Input property change, set internal state for our component
	        set: function (itemsList) {
	            this.connections = itemsList;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ConnectionsListMobileComponent.prototype, "count", {
	        // When count from Input property changes, set internal state for our component
	        set: function (count) {
	            this.connectionsCount = count;
	            if (count > 4) {
	                this.moreVisible = true;
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    __decorate([
	        core_1.Input(), 
	        __metadata('design:type', Array), 
	        __metadata('design:paramtypes', [Array])
	    ], ConnectionsListMobileComponent.prototype, "items", null);
	    __decorate([
	        core_1.Input(), 
	        __metadata('design:type', Number), 
	        __metadata('design:paramtypes', [Number])
	    ], ConnectionsListMobileComponent.prototype, "count", null);
	    ConnectionsListMobileComponent = __decorate([
	        core_1.Component({
	            selector: 'prs-mobile-connections-list',
	            template: __webpack_require__(887),
	            directives: [directives_1.CheckImageDirective],
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], ConnectionsListMobileComponent);
	    return ConnectionsListMobileComponent;
	}());
	exports.ConnectionsListMobileComponent = ConnectionsListMobileComponent;


/***/ },

/***/ 750:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var LESS_ITEMS_LIMIT = 6;
	var ItemsListMobileComponent = (function () {
	    function ItemsListMobileComponent() {
	        // List of component items
	        this.itemsLess = [];
	        this.itemsMore = [];
	        // Counter for total number of items
	        this.itemsCounter = 0;
	        // Indicator whether more items are visible in the UI
	        this.itemsMoreVisible = false;
	        // Indicator whether moreButton is visible in the UI
	        this.moreButtonVisible = false;
	    }
	    Object.defineProperty(ItemsListMobileComponent.prototype, "items", {
	        // When [items] from Input property change, set internal state for our component
	        set: function (listOfItems) {
	            this._setState(listOfItems);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    ItemsListMobileComponent.prototype.toggleMore = function (event) {
	        this.itemsMoreVisible = !this.itemsMoreVisible;
	    };
	    /**
	     * Set itemsLess, itemsMore, counters and visibility flag for more button
	     * @param {any[]} listOfItems
	     */
	    ItemsListMobileComponent.prototype._setState = function (listOfItems) {
	        this.itemsCounter = listOfItems.length;
	        if (this.itemsCounter > LESS_ITEMS_LIMIT) {
	            this.itemsLess = listOfItems.slice(0, LESS_ITEMS_LIMIT);
	            this.itemsMore = listOfItems.slice(LESS_ITEMS_LIMIT, this.itemsCounter);
	            this.moreButtonVisible = true;
	        }
	        else {
	            this.itemsLess = listOfItems;
	            this.moreButtonVisible = false;
	        }
	    };
	    __decorate([
	        core_1.Input(), 
	        __metadata('design:type', Array), 
	        __metadata('design:paramtypes', [Array])
	    ], ItemsListMobileComponent.prototype, "items", null);
	    ItemsListMobileComponent = __decorate([
	        core_1.Component({
	            selector: 'prs-mobile-items-list',
	            template: __webpack_require__(888),
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], ItemsListMobileComponent);
	    return ItemsListMobileComponent;
	}());
	exports.ItemsListMobileComponent = ItemsListMobileComponent;


/***/ },

/***/ 751:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var ProfileFooterMobileComponent = (function () {
	    function ProfileFooterMobileComponent() {
	        this.onAcceptPassEvent = new core_1.EventEmitter();
	        this.passIsActive = false;
	        this.acceptIsActive = false;
	    }
	    ProfileFooterMobileComponent.prototype.pass = function (event) {
	        var _this = this;
	        this.acceptIsActive = false;
	        if (this.timeoutAccept) {
	            window.clearTimeout(this.timeoutAccept);
	        }
	        if (this.passIsActive) {
	            return;
	        }
	        this.passIsActive = true;
	        if (this.timeoutPass) {
	            window.clearTimeout(this.timeoutPass);
	        }
	        this.timeoutPass = setTimeout(function () {
	            _this.onAcceptPassEvent.emit({ userId: _this.userId, status: -1 });
	        }, 1500);
	    };
	    ProfileFooterMobileComponent.prototype.accept = function (event) {
	        var _this = this;
	        this.passIsActive = false;
	        if (this.timeoutPass) {
	            window.clearTimeout(this.timeoutPass);
	        }
	        if (this.acceptIsActive) {
	            return;
	        }
	        this.acceptIsActive = true;
	        if (this.timeoutAccept) {
	            window.clearTimeout(this.timeoutAccept);
	        }
	        this.timeoutAccept = setTimeout(function () {
	            _this.onAcceptPassEvent.emit({ userId: _this.userId, status: 0 });
	        }, 1500);
	    };
	    __decorate([
	        core_1.Input(), 
	        __metadata('design:type', Number)
	    ], ProfileFooterMobileComponent.prototype, "score", void 0);
	    __decorate([
	        core_1.Input(), 
	        __metadata('design:type', String)
	    ], ProfileFooterMobileComponent.prototype, "type", void 0);
	    __decorate([
	        core_1.Input(), 
	        __metadata('design:type', Number)
	    ], ProfileFooterMobileComponent.prototype, "userId", void 0);
	    __decorate([
	        core_1.Output(), 
	        __metadata('design:type', core_1.EventEmitter)
	    ], ProfileFooterMobileComponent.prototype, "onAcceptPassEvent", void 0);
	    ProfileFooterMobileComponent = __decorate([
	        core_1.Component({
	            selector: 'prs-mobile-profile-footer',
	            template: __webpack_require__(889),
	            changeDetection: core_1.ChangeDetectionStrategy.OnPush
	        }), 
	        __metadata('design:paramtypes', [])
	    ], ProfileFooterMobileComponent);
	    return ProfileFooterMobileComponent;
	}());
	exports.ProfileFooterMobileComponent = ProfileFooterMobileComponent;


/***/ },

/***/ 752:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var pipes_1 = __webpack_require__(108);
	var directives_1 = __webpack_require__(13);
	var model_1 = __webpack_require__(746);
	var about_mobile_component_1 = __webpack_require__(748);
	var connections_list_mobile_component_1 = __webpack_require__(749);
	var items_list_component_1 = __webpack_require__(750);
	var core_2 = __webpack_require__(5);
	var services_1 = __webpack_require__(8);
	var UserProfileComponent = (function () {
	    function UserProfileComponent(_religiousViewsService, _politicalViewsService, _friendService) {
	        this._religiousViewsService = _religiousViewsService;
	        this._politicalViewsService = _politicalViewsService;
	        this._friendService = _friendService;
	        this.onCloseProfile = new core_1.EventEmitter();
	        // Boolean flag which controls whether full profile information is collapsed and visible
	        this.profileExtraInfoVisible = false;
	        // List of religious views for person
	        this.religiousViews = [];
	        // List of political views for person
	        this.politicalViews = [];
	        // List and counters for mutual friends
	        this.friendsTotalCount = 0;
	        this.friendsPreview = [];
	        this.friendsPersice = [];
	        this.friendsFacebook = [];
	        this.friendsLinkedin = [];
	        this.friendsTwitterFollowers = [];
	        this.friendsTwitterFriends = [];
	        // Indicator for which tab is active: interests(0), goals(1), offers(2)
	        this.activeTab = 0;
	    }
	    Object.defineProperty(UserProfileComponent.prototype, "user", {
	        // When [user] from Input property change, set internal state for our component
	        set: function (value) {
	            this._setState(value);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    UserProfileComponent.prototype.ngAfterViewInit = function () {
	        setTimeout(function () {
	            window.scrollTo(0, 0);
	        });
	    };
	    UserProfileComponent.prototype.toggleProfileExtraInfoVisibility = function (event) {
	        this.profileExtraInfoVisible = !this.profileExtraInfoVisible;
	    };
	    /**
	     * Activate interests, goals or offers tab
	     * @param {number} tab active tab: interests(0), goals(1), offers(2)
	     */
	    UserProfileComponent.prototype.activateTab = function (tab) {
	        this.activeTab = tab;
	    };
	    UserProfileComponent.prototype._getReligiousViews = function (id) {
	        var _this = this;
	        this._religiousViewsService.getByUser('', 100, id)
	            .subscribe(function (data) {
	            if (data.meta.total_count > 0) {
	                var items = data.objects;
	                _this.religiousViews = items;
	            }
	        });
	    };
	    UserProfileComponent.prototype._getPoliticalViews = function (id) {
	        var _this = this;
	        this._politicalViewsService.getByUser('', 100, id)
	            .subscribe(function (data) {
	            if (data.meta.total_count > 0) {
	                var items = data.objects;
	                _this.politicalViews = items;
	            }
	        });
	    };
	    UserProfileComponent.prototype._getMutualFriends = function (id) {
	        var _this = this;
	        this._friendService.get('', 100, id)
	            .subscribe(function (data) {
	            if (data.meta.total_count > 0) {
	                var items = data.objects[0];
	                _this.friendsTotalCount += parseInt(items.mutual_bk_friends_count, 10);
	                _this.friendsTotalCount += parseInt(items.mutual_fb_friends_count, 10);
	                _this.friendsTotalCount += parseInt(items.mutual_linkedin_connections_count, 10);
	                _this.friendsTotalCount += parseInt(items.mutual_twitter_followers_count, 10);
	                _this.friendsTotalCount += parseInt(items.mutual_twitter_friends_count, 10);
	                _this.friendsPersice = items.mutual_bk_friends;
	                _this.friendsFacebook = items.mutual_fb_friends;
	                _this.friendsLinkedin = items.mutual_linkedin_connections;
	                _this.friendsTwitterFriends = items.mutual_twitter_friends;
	                _this.friendsTwitterFollowers = items.mutual_twitter_followers;
	                // Pick four friends for preview
	                _this.friendsPreview = core_2.FriendUtil.pickFourFriendsforPreview(_this.friendsPersice, _this.friendsFacebook, _this.friendsLinkedin, _this.friendsTwitterFriends, _this.friendsTwitterFollowers);
	            }
	        });
	    };
	    UserProfileComponent.prototype._setState = function (value) {
	        this.person = new model_1.Person(value);
	        this._getReligiousViews(this.person.id);
	        this._getPoliticalViews(this.person.id);
	        this._getMutualFriends(this.person.id);
	    };
	    __decorate([
	        core_1.Input(), 
	        __metadata('design:type', String)
	    ], UserProfileComponent.prototype, "type", void 0);
	    __decorate([
	        core_1.Input(), 
	        __metadata('design:type', Object), 
	        __metadata('design:paramtypes', [Object])
	    ], UserProfileComponent.prototype, "user", null);
	    __decorate([
	        core_1.Output(), 
	        __metadata('design:type', core_1.EventEmitter)
	    ], UserProfileComponent.prototype, "onCloseProfile", void 0);
	    UserProfileComponent = __decorate([
	        core_1.Component({
	            selector: 'prs-user-profile',
	            template: __webpack_require__(890),
	            pipes: [pipes_1.GenderPipe],
	            directives: [
	                directives_1.CheckImageDirective,
	                about_mobile_component_1.AboutMobileComponent,
	                items_list_component_1.ItemsListMobileComponent,
	                connections_list_mobile_component_1.ConnectionsListMobileComponent
	            ],
	            providers: [
	                services_1.ReligiousViewsService,
	                services_1.PoliticalViewsService,
	                services_1.MutualFriendsService
	            ]
	        }), 
	        __metadata('design:paramtypes', [services_1.ReligiousViewsService, services_1.PoliticalViewsService, services_1.MutualFriendsService])
	    ], UserProfileComponent);
	    return UserProfileComponent;
	}());
	exports.UserProfileComponent = UserProfileComponent;


/***/ },

/***/ 874:
/***/ function(module, exports) {

	module.exports = "<nav class=\"push-menu push-menu--left\" id=\"push-menu-s1\">\n  <div class=\"push-menu__logo\">\n    <a class=\"site-logo\">\n      <img alt=\"Perice\" src=\"/static/assets/images/logo.svg\" class=\"site-logo__mark\">\n      <h1 class=\"site-logo__type\">Persice</h1> </a>\n  </div>\n  <prs-mobile-navigation></prs-mobile-navigation>\n</nav>\n<div class=\"content-mask\" prs-close-left-menu></div>\n<div class=\"container push-menu-push\">\n  <header class=\"mob-header\" [ngClass]=\"{'is-hidden': !isHeaderVisible}\">\n    <div class=\"layout layout--flush layout--middle\">\n      <div class=\"layout__item 1/5\">\n        <a prs-open-left-menu class=\"mob-header__left-push\" id=\"showLeftPush\">\n          <svg role=\"img\" class=\"icon icon--small\">\n            <use xlink:href=\"/static/assets/icons/icons.svg#icon-hamburger\"></use>\n          </svg>\n        </a>\n      </div>\n      <div class=\"layout__item 3/5 text-center\">\n        <prs-page-title [title]=\"pageTitle\"></prs-page-title>\n      </div>\n      <div class=\"layout__item 1/5 text-right\" *prsIfRoutesActive=\"pagesWithFilter\">\n        <a (click)=\"setFilterVisible($event)\" class=\"mob-header__right-push\">\n          <svg role=\"img\" class=\"icon icon--small\">\n            <use xlink:href=\"/static/assets/icons/icons.svg#icon-search-mobile\"></use>\n          </svg>\n        </a>\n      </div>\n    </div>\n  </header>\n  <div class=\"content\">\n    <router-outlet></router-outlet>\n  </div>\n</div>\n<prs-mobile-profile-footer *ngIf=\"isFooterVisible\" (onAcceptPassEvent)=\"setFriendshipStatus($event)\" [type]=\"footerType\" [userId]=\"footerUserId\" [score]=\"footerScore\"></prs-mobile-profile-footer>\n"

/***/ },

/***/ 875:
/***/ function(module, exports) {

	module.exports = "<div [ngClass]=\"{'is-hidden': isFilterVisible || itemViewActive}\"\n  prs-infinite-scroll (scrolled)=\"loadMoreItems($event)\"\n  [scrollEnabled]=\"!isFilterVisible && !itemViewActive\"\n  [bottomOffset]=\"60\">\n  <prs-mobile-user-card (onProfileTap)=\"selectItem($event)\" [person]=\"person\"\n    *ngFor=\"let person of items; trackBy:id\"></prs-mobile-user-card>\n  <prs-loading [status]=\"loading\"></prs-loading>\n</div>\n<prs-mobile-filter [ngClass]=\"{'is-hidden': !isFilterVisible}\" [type]=\"LIST_TYPE\"></prs-mobile-filter>\n<prs-user-profile *ngIf=\"itemViewActive\" [user]=\"selectedItem\" [type]=\"'connection'\"\n  (onCloseProfile)=\"closeItemView($event)\">\n</prs-user-profile>\n"

/***/ },

/***/ 876:
/***/ function(module, exports) {

	module.exports = "<div [ngClass]=\"{'is-hidden': isFilterVisible || itemViewActive}\"\n  prs-infinite-scroll (scrolled)=\"loadMoreItems($event)\"\n  [scrollEnabled]=\"!isFilterVisible && !itemViewActive\"\n  [bottomOffset]=\"60\">\n  <prs-mobile-user-card (onProfileTap)=\"selectItem($event)\" [person]=\"person\"\n    *ngFor=\"let person of items; trackBy:id\"></prs-mobile-user-card>\n  <prs-loading [status]=\"loading\"></prs-loading>\n</div>\n<prs-mobile-filter [ngClass]=\"{'is-hidden': !isFilterVisible}\" [type]=\"LIST_TYPE\"></prs-mobile-filter>\n<prs-user-profile *ngIf=\"itemViewActive\" [user]=\"selectedItem\" [type]=\"'crowd'\"\n  (onCloseProfile)=\"closeItemView($event)\">\n</prs-user-profile>\n"

/***/ },

/***/ 877:
/***/ function(module, exports) {

	module.exports = "<p>\n  Events\n</p>\n\n"

/***/ },

/***/ 878:
/***/ function(module, exports) {

	module.exports = "<p>\n  Messages\n</p>\n"

/***/ },

/***/ 879:
/***/ function(module, exports) {

	module.exports = "<p>\n  My profile\n</p>\n"

/***/ },

/***/ 880:
/***/ function(module, exports) {

	module.exports = "<nav class=\"mob-nav-main\">\n  <ul>\n    <li>\n      <a [routerLink]=\"['./MyProfile']\">\n        <svg role=\"img\" class=\"icon \">\n          <use xlink:href=\"/static/assets/icons/icons.svg#icon-menu-profile\"></use>\n        </svg> <span>My Profile</span>\n      </a>\n    </li>\n    <li>\n      <a [routerLink]=\"['./Crowd']\">\n        <svg role=\"img\" class=\"icon \">\n          <use xlink:href=\"/static/assets/icons/icons.svg#icon-menu-crowd\"></use>\n        </svg> <span>Crowd</span>\n      </a>\n    </li>\n    <li>\n      <a [routerLink]=\"['./Messages']\">\n        <svg role=\"img\" class=\"icon \">\n          <use xlink:href=\"/static/assets/icons/icons.svg#icon-menu-messages\"></use>\n        </svg> <span>Messages</span><!-- <i class=\"mob-nav-main__value\">32</i> -->\n      </a>\n    </li>\n    <li>\n      <a [routerLink]=\"['./Connections']\">\n        <svg role=\"img\" class=\"icon \">\n          <use xlink:href=\"/static/assets/icons/icons.svg#icon-menu-connections\"></use>\n        </svg> <span>Connections</span><!-- <i class=\"mob-nav-main__value\">3</i> -->\n      </a>\n    </li>\n    <li>\n      <a [routerLink]=\"['./Events']\">\n        <svg role=\"img\" class=\"icon \">\n          <use xlink:href=\"/static/assets/icons/icons.svg#icon-menu-events\"></use>\n        </svg> <span>Events</span>\n      </a>\n    </li>\n    <li>\n      <a [routerLink]=\"['./Settings']\">\n        <svg role=\"img\" class=\"icon \">\n          <use xlink:href=\"/static/assets/icons/icons.svg#icon-menu-settings\"></use>\n        </svg> <span>Settings</span>\n      </a>\n    </li>\n    <li>\n      <a href=\"/accounts/logout/\">\n        <svg role=\"img\" class=\"icon \">\n          <use xlink:href=\"/static/assets/icons/icons.svg#icon-menu-logout\"></use>\n        </svg> <span>Logout</span></a>\n    </li>\n  </ul>\n</nav>\n"

/***/ },

/***/ 881:
/***/ function(module, exports) {

	module.exports = "<p>\n  Settings\n</p>\n"

/***/ },

/***/ 882:
/***/ function(module, exports) {

	module.exports = "<div class=\"filter-container\">\n  <header class=\"mob-header\">\n    <div class=\"layout layout--flush layout--middle\">\n      <div class=\"layout__item 1/5\">\n        <a (click)=\"onBack($event)\" class=\"mob-header__left-push\">\n          <svg role=\"img\" class=\"icon icon--small\">\n            <use xlink:href=\"/static/assets/icons/icons.svg#icon-mobile_back\"></use>\n          </svg>\n        </a>\n      </div>\n      <div class=\"layout__item 3/5 text-center\">\n        <ul class=\"mob-header-tabs\">\n          <li class=\"1/2\" [ngClass]=\"{'mob-header-tab-current': filtersVisible}\">\n            <a (click)=\"activateTab('filters')\" class=\"js-mob-header-tab__filters\">Filters</a>\n          </li>\n          <li class=\"1/2\" [ngClass]=\"{'mob-header-tab-current': keywordsVisible}\">\n            <a (click)=\"activateTab('keywords')\" class=\"js-mob-header-tab__keywords\">Keywords</a>\n          </li>\n        </ul>\n      </div>\n      <div class=\"layout__item 1/5 text-right\">\n        <a (click)=\"onGo($event)\" class=\"mob-header__right-push\">Go</a>\n      </div>\n    </div>\n  </header>\n  <div class=\"filter\" [ngClass]=\"{'hidden': keywordsVisible}\">\n    <div class=\"filter__items\">\n      <div class=\"filter__item\">\n        <h3 class=\"filter__item__title mb--\">Gender</h3>\n        <div class=\"layout layout--flush\">\n          <div class=\"layout__item 1/3\">\n            <label class=\"c-radio\">\n              <input class=\"c-radio__input\" type=\"radio\" name=\"radio\" value=\"m,f\" #all (click)=\"changeGender(all.value)\" [checked]=\"gender === 'm,f'\">\n              <span class=\"c-radio__trigger\"></span>\n              <span class=\"c-radio__label\">All</span>\n            </label>\n          </div>\n          <div class=\"layout__item 1/3\">\n            <label class=\"c-radio\">\n              <input class=\"c-radio__input\" type=\"radio\" name=\"radio\" value=\"m\" #male (click)=\"changeGender(male.value)\" [checked]=\"gender === 'm'\">\n              <span class=\"c-radio__trigger\"></span>\n              <span class=\"c-radio__label\">Male</span>\n            </label>\n          </div>\n          <div class=\"layout__item 1/3\">\n            <label class=\"c-radio\">\n              <input class=\"c-radio__input\" type=\"radio\" name=\"radio\" value=\"f\" #female (click)=\"changeGender(female.value)\" [checked]=\"gender === 'f'\">\n              <span class=\"c-radio__trigger\"></span>\n              <span class=\"c-radio__label\">Female</span>\n            </label>\n          </div>\n        </div>\n      </div>\n      <div class=\"filter__item\">\n        <div class=\"layout layout--middle\">\n          <div class=\"layout__item 1/2 mb-\">\n            <h3 class=\"filter__item__title\">Age</h3> </div>\n          <div class=\"layout__item 1/2 text-right mb-\">\n            <span class=\"range-value\">{{minAge}} - {{maxAge}}</span>\n          </div>\n        </div>\n        <prs-range-slider [renderSlider]=\"renderSlider\" [options]=\"rangeSliderOptionsAge\" (onChange)=\"ageChanged($event)\" (onFinish)=\"saveAge($event)\" [class]=\"'range'\"></prs-range-slider>\n      </div>\n      <div class=\"filter__item\">\n        <div class=\"layout layout--middle\">\n          <div class=\"layout__item 1/2 mb-\">\n            <h3 class=\"filter__item__title\">Distance</h3> </div>\n          <div class=\"layout__item 1/2 text-right mb-\">\n            <span class=\"range-value\">{{ distanceValue | numeral }} {{distanceUnit}}</span>\n          </div>\n        </div>\n        <prs-range-slider [renderSlider]=\"renderSlider\" [options]=\"rangeSliderOptionsDistance\" (onChange)=\"distanceChanged($event)\" (onFinish)=\"saveDistance($event)\" [class]=\"'range-to'\"></prs-range-slider>\n      </div>\n      <div class=\"filter__item\">\n        <h3 class=\"filter__item__title mb-\">Order by</h3>\n        <select minimalect (selectedValue)=\"changeOrder($event)\">\n          <option *ngFor=\"let order of orderBy\" [value]=\"order.value\" [selected]=\"order.selected\">{{order.label}}</option>\n        </select>\n      </div>\n    </div>\n  </div>\n  <div class=\"keywords js-keywords-tab\" [ngClass]=\"{'hidden': filtersVisible}\">\n    <prs-mobile-keywords></prs-mobile-keywords>\n  </div>\n</div>\n"

/***/ },

/***/ 883:
/***/ function(module, exports) {

	module.exports = "<div class=\"user-card__similarity__drop is-open\">\n  <ul class=\"user-card__similarity__list\">\n    <li *ngFor=\"let key of _person.topInterestsFirstHalf\"><i *ngIf=\"key && key.match\" class=\"interest-list__bullet\"></i>{{key.value}}</li>\n  </ul>\n  <ul class=\"user-card__similarity__list\">\n    <li *ngFor=\"let key of _person.topInterestsSecondHalf\"><i *ngIf=\"key && key.match\" class=\"interest-list__bullet\"></i>{{key.value}}</li>\n  </ul>\n</div>\n"

/***/ },

/***/ 884:
/***/ function(module, exports) {

	module.exports = "<div class=\"search\">\n  <div class=\"search__top typeahead-search\" id=\"typeahead-search\">\n    <svg role=\"img\" class=\"icon\">\n      <use xlink:href=\"/static/assets/icons/icons.svg#icon-search\"></use>\n    </svg>\n    <input [(ngModel)]=\"newItemText\" (keyup)=\"inputChanged($event)\" type=\"text\" class=\"search__input\" placeholder=\"Enter a keyword here\" id=\"typeaheadInput\">\n    <prs-search></prs-search>\n    <div class=\"search__notification search__notification--error\" [ngClass]=\"{'is-visible': status === 'failure'}\">\n      <svg role=\"img\" class=\"icon \">\n        <use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"/static/assets/icons/icons.svg#icon-failure\"></use>\n      </svg>\n    </div>\n    <div class=\"search__notification search__notification--succes\" [ngClass]=\"{'is-visible': status === 'success'}\">\n      <svg role=\"img\" class=\"icon \">\n        <use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"/static/assets/icons/icons.svg#icon-success-2\"></use>\n      </svg>\n    </div>\n    <button class=\"btn\" (click)=\"add($event)\">\n      <svg role=\"img\" class=\"icon \">\n        <use xlink:href=\"/static/assets/icons/icons.svg#icon-plus-big\"></use>\n      </svg>\n    </button>\n  </div>\n</div>\n<div class=\"search__tags-wrapper text-left\" *ngIf=\"items.length > 0\">\n  <p class=\"search-tag-secondary\" *ngFor=\"let item of items\">\n    <a (click)=\"remove(item)\">\n      <svg role=\"img\" class=\"icon \">\n        <use xlink:href=\"/static/assets/icons/icons.svg#icon-delete\"></use>\n      </svg>\n    </a> {{item}}</p>\n</div>\n"

/***/ },

/***/ 885:
/***/ function(module, exports) {

	module.exports = "<div class=\"user-card\">\n  <div class=\"flag flag--small flag--top\">\n    <div class=\"flag__img\" (click)=\"selectPerson($event)\">\n      <div class=\"avatar-place\">\n        <div class=\"avatar avatar--small\" checkimage=\"{{_person.image}}\" [suffix]=\"'.56x56_q100_crop.jpg'\">\n        </div>\n      </div>\n    </div>\n    <div class=\"flag__body\">\n      <div class=\"user-card__name\" (click)=\"selectPerson($event)\"> {{_person.firstName}} </div>\n      <div class=\"user-card__user-details\" (click)=\"selectPerson($event)\"> {{_person.gender}} / Age {{_person.age}} / {{_person.distance}} {{_person.distanceUnit}} </div>\n      <a (click)=\"toggleInterestsVisible($event)\" class=\"user-card__similarity js-user-card__similarity\" [ngClass]=\"{'is-open': interestsVisible }\">\n        <span class=\"user-card__similarity__value\">\n          <svg role=\"img\" class=\"icon icon--extratiny\">\n            <use xlink:href=\"/static/assets/icons/icons.svg#icon-mob-similar\"></use>\n          </svg> {{_person.score}}&deg;\n        </span>\n        <span class=\"user-card__similarity__label\">Similar</span>\n        <svg role=\"img\" class=\"icon icon--extratiny icon-arrow\">\n          <use xlink:href=\"/static/assets/icons/icons.svg#icon-down-small\"></use>\n        </svg>\n        <prs-mobile-interests-card [person]=\"_person\" *ngIf=\"interestsVisible\"></prs-mobile-interests-card>\n      </a>\n    </div>\n  </div>\n</div>\n"

/***/ },

/***/ 886:
/***/ function(module, exports) {

	module.exports = "<div class=\"profile-about\">\n  <span class=\"profile-about__text\">{{aboutLess}}<span class=\"moreellipses\" [ngClass]=\"{'is-visible': aboutMore.length > 0 && !showMore}\">...</span>\n    <span class=\"morecontent\" *ngIf=\"aboutMore.length > 0\">\n      <span [ngClass]=\"{'is-visible': showMore}\">{{aboutMore}}</span>&nbsp;&nbsp;\n      <a (click)=\"toggleMore(true)\" class=\"morelink\" *ngIf=\"!showMore\">View more</a>\n      <a (click)=\"toggleMore(false)\" class=\"morelink less\" *ngIf=\"showMore\">View less</a>\n    </span>\n  </span>\n</div>\n"

/***/ },

/***/ 887:
/***/ function(module, exports) {

	module.exports = "<span class=\"profile-titleline\">Connections\n      <span class=\"profile-titleline__value\">({{connectionsCount}})</span> <span class=\"profile-titleline__subvalue\"></span>\n</span>\n<div class=\"has-user-links\">\n  <div class=\"layout layout--small\">\n    <div class=\"layout__item 1/5\" *ngFor=\"let item of connections\">\n      <a class=\"user-link\" *ngIf=\"item.type === 'persice'\">\n        <div class=\"avatar avatar--small\" checkimage=\"{{item.image}}\" [suffix]=\"'.56x56_q100_crop.jpg'\"></div>\n        <span class=\"user-link__username\">{{item.first_name}}</span>\n      </a>\n      <a class=\"user-link\" *ngIf=\"item.type === 'facebook'\">\n        <div class=\"avatar avatar--small\" [ngStyle]=\"{'background-image': 'url(' + '//graph.facebook.com/' + item.facebook_id + '/picture?type=square' + ')'}\"></div>\n        <span class=\"user-link__username\">{{item.first_name}}</span>\n      </a>\n      <a class=\"user-link\" *ngIf=\"item.type === 'linkedin'\">\n        <div class=\"avatar avatar--small\" [ngStyle]=\"{'background-image': 'url(' + item.pictureUrls.values[0] + ')'}\"></div>\n        <span class=\"user-link__username\">{{item.firstName}}</span>\n      </a>\n      <a class=\"user-link\" *ngIf=\"item.type === 'twitter'\">\n        <div class=\"avatar avatar--small\" [ngStyle]=\"{'background-image': 'url(' + item.profile_image_url + ')'}\"></div>\n        <span class=\"user-link__username\">{{item.name}}</span>\n      </a>\n    </div>\n    <div class=\"layout__item 1/5 text-center\" *ngIf=\"moreVisible\">\n      <a>\n        <svg role=\"img\" class=\"icon \">\n          <use xlink:href=\"/static/assets/icons/icons.svg#icon-arrow_swipe_right\"></use>\n        </svg>\n      </a>\n    </div>\n    <div class=\"layout__item text-center\" *ngIf=\"connectionsCount === 0\">\n\n    </div>\n  </div>\n</div>\n"

/***/ },

/***/ 888:
/***/ function(module, exports) {

	module.exports = "<ul class=\"profile-tab__list\">\n  <li [ngClass]=\"{'profile-tab__list__pro-item': item.match}\" *ngFor=\"let item of itemsLess\">\n    <i *ngIf=\"item.match\" class=\"similarity-bullet\"></i>{{item.value}}\n  </li>\n  <li [ngClass]=\"{'hidden': !itemsMoreVisible, 'profile-tab__list__pro-item': item.match}\" *ngFor=\"let item of itemsMore\">\n    <i *ngIf=\"item.match\" class=\"similarity-bullet\"></i>{{item.value}}\n  </li>\n</ul>\n<a *ngIf=\"moreButtonVisible\" (tap)=\"toggleMore($event)\" class=\"js-profile-tab__list__toggle profile-tab__list__toggle\">\n  <svg role=\"img\" class=\"icon icon--small profile-box__toggle-icon\">\n    <use xlink:href=\"/static/assets/icons/icons.svg#icon-mobile_menu\"></use>\n  </svg>\n</a>\n"

/***/ },

/***/ 889:
/***/ function(module, exports) {

	module.exports = "<footer class=\"profile-footer\">\n <!-- footer crowd profile -->\n   <div class=\"layout layout--flush mh-\" *ngIf=\"type === 'crowd'\">\n    <div class=\"layout__item text-center 1/3\">\n      <a class=\"pass-accept pass-accept__pass\" (tap)=\"pass($event)\" [ngClass]=\"{'is-active': passIsActive}\">\n        <svg role=\"img\" class=\"icon red\">\n          <use xlink:href=\"/static/assets/icons/icons.svg#icon-pass\"></use>\n        </svg>\n      </a>\n    </div>\n    <div class=\"layout__item text-center 1/3\">\n      <div class=\"profile-footer__similarity\">\n        <div class=\"profile-footer__similarity__value\">{{score}}&deg;</div>\n        <div class=\"profile-footer__similarity__label\">Similar</div>\n        <div class=\"profile-footer__similarity__progres\"></div>\n      </div>\n    </div>\n    <div class=\"layout__item text-center 1/3\">\n      <a class=\"pass-accept pass-accept__accept\" (tap)=\"accept($event)\" [ngClass]=\"{'is-active': acceptIsActive}\">\n        <svg role=\"img\" class=\"icon green\">\n          <use xlink:href=\"/static/assets/icons/icons.svg#icon-accepted\"></use>\n        </svg>\n      </a>\n    </div>\n  </div>\n\n  <!-- footer connection profile -->\n  <a class=\"profile-footer__message\" *ngIf=\"type === 'connection'\">\n    <svg role=\"img\" class=\"icon \">\n      <use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"/static/assets/icons/icons.svg#icon-menu-messages\"></use>\n    </svg>\n  </a>\n</footer>\n"

/***/ },

/***/ 890:
/***/ function(module, exports) {

	module.exports = "<div class=\"user-profile-container\">\n  <header class=\"mob-header mob-header--transparent\">\n    <div class=\"layout layout--flush layout--middle\">\n      <div class=\"layout__item 1/5\">\n        <a (click)=\"onCloseProfile.emit($event)\" class=\"mob-header__left-push\">\n          <svg role=\"img\" class=\"icon icon--small\">\n            <use xlink:href=\"/static/assets/icons/icons.svg#icon-mobile_back\"></use>\n          </svg>\n        </a>\n      </div>\n      <div class=\"layout__item 3/5 text-center\"> </div>\n      <div class=\"layout__item 1/5 text-right\" *ngIf=\"type === 'crowd'\"> </div>\n      <div class=\"layout__item 1/5 text-right\" *ngIf=\"type === 'connection'\">\n        <a class=\"js-mob-header__profile-drop-trigg\">\n          <svg role=\"img\" class=\"icon icon--small\">\n            <use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"/static/dist/assets/icons/icons.svg#icon-mobile_menu\"></use>\n          </svg>\n        </a>\n        <ul class=\"mob-header__drop js-mob-header__drop hidden\">\n          <li><a href=\"\">Invite to event</a></li>\n          <li><a href=\"\">Report user</a></li>\n          <li><a href=\"\">Disconnect</a></li>\n        </ul>\n      </div>\n    </div>\n  </header>\n  <div class=\"profile-hero\">\n    <div class=\"profile-hero__name\">{{person.firstName}}</div>\n    <div class=\"profile-hero__name-meta\">{{person.distance}} {{person.distanceUnit}} from you</div>\n    <div class=\"profile-avatarplace\">\n      <div class=\"match-profile__avatar-place\">\n        <div class=\"match-profile__avatar\" checkimage=\"{{person.image}}\" [suffix]=\"'.120x120_q100_crop.jpg'\">\n        </div>\n        <br>\n        <div class=\"match-percent-large\"></div>\n      </div>\n    </div>\n    <prs-mobile-profile-about-me [about]=\"person.about\"></prs-mobile-profile-about-me>\n    <div class=\"profile-hero-fake-bg-overlay\"></div>\n    <img [src]=\"person.image\" alt=\"User name\" class=\"profile-hero-fake-bg\">\n  </div>\n  <div class=\"profile-info profile-box\">\n    <div class=\"profile-box__sub\">\n      <div class=\"layout\">\n        <div class=\"layout__item 1/3\"> <span class=\"profile-info__label\">Gender</span> <span class=\"profile-info__value\">{{person.gender}}</span> </div>\n        <div class=\"layout__item 1/3\"> <span class=\"profile-info__label\">Age</span> <span class=\"profile-info__value\">{{person.age}}</span> </div>\n        <div class=\"layout__item 1/3\"> <span class=\"profile-info__label\">Lives in</span> <span class=\"profile-info__value\">{{person.livesIn}}</span> </div>\n      </div>\n    </div>\n    <div class=\"profile-box__collapse js-profile-box__collapse\" [ngClass]=\"{'hidden': !profileExtraInfoVisible}\">\n      <div class=\"profile-box__sub\">\n        <div class=\"layout\">\n          <div class=\"layout__item\"> <span class=\"profile-info__label\">Job / Company</span>\n            <span class=\"profile-info__value\" *ngIf=\"person.job.length > 0 && person.company.length > 0\">{{person.job}} at {{person.company}}</span>\n          </div>\n        </div>\n      </div>\n      <div class=\"profile-box__sub\">\n        <div class=\"layout\">\n          <div class=\"layout__item 1/2\">\n            <span class=\"profile-info__label\">Religious Views</span> <span class=\"profile-info__value\" *ngFor=\"let rel of profileReligiousViews\">{{rel.religious_view}}</span> </div>\n          <div class=\"layout__item 1/2\"> <span class=\"profile-info__label\">Political Views</span> <span class=\"profile-info__value\" *ngFor=\"let rel of profilePoliticalViews\">{{rel.political_view}}</span> </div>\n        </div>\n      </div>\n      <div class=\"profile-box__sub\"> <span class=\"profile-info__label mb--\">Networks</span>\n        <div class=\"layout\">\n          <div class=\"layout__item 1/3 text-center\" *ngIf=\"person.twitterUrl.length > 0\">\n            <a href=\"{{person.twitterUrl}}\" target=\"_new\">\n              <svg role=\"img\" class=\"icon icon--medium\">\n                <use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"/static/assets/icons/icons.svg#icon-twitter_middle\"></use>\n              </svg>\n            </a>\n          </div>\n          <div class=\"layout__item 1/3 text-center\" *ngIf=\"person.linkedinUrl.length > 0\">\n            <a href=\"{{person.linkedinUrl}}\" target=\"_new\">\n              <svg role=\"img\" class=\"icon icon--medium\">\n                <use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"/static/assets/icons/icons.svg#icon-linkedin_middle\"></use>\n              </svg>\n            </a>\n          </div>\n          <div class=\"layout__item 1/3 text-center\" *ngIf=\"person.facebookUrl.length > 0\">\n            <a href=\"{{person.facebookUrl}}\" target=\"_new\">\n              <svg role=\"img\" class=\"icon icon--medium\">\n                <use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"/static/assets/icons/icons.svg#icon-facebook_middle\"></use>\n              </svg>\n            </a>\n          </div>\n        </div>\n      </div>\n    </div>\n    <a class=\"js-profile-box__toggle profile-box__toggle\" (tap)=\"toggleProfileExtraInfoVisibility($event)\">\n      <svg role=\"img\" class=\"icon icon--small profile-box__toggle-icon\">\n        <use xlink:href=\"/static/assets/icons/icons.svg#icon-mobile_menu\"></use>\n      </svg>\n    </a>\n  </div>\n  <div class=\"profile-tabs profile-box\">\n    <ul class=\"list-bare js-tabs profile-tabs__tabs side-nav\">\n      <li (tap)=\"activateTab(0)\" [ngClass]=\"{'is-active': activeTab === 0}\"> <span class=\"profile-titleline\">Interests <span class=\"profile-titleline__value\">({{person.interestsCount}})</span></span>\n      </li>\n      <li (tap)=\"activateTab(1)\" [ngClass]=\"{'is-active': activeTab === 1}\"> <span class=\"profile-titleline\">Goals <span class=\"profile-titleline__value\">({{person.goalsCount}})</span></span>\n      </li>\n      <li (tap)=\"activateTab(2)\" [ngClass]=\"{'is-active': activeTab === 2}\"> <span class=\"profile-titleline\">Offers <span class=\"profile-titleline__value\">({{person.offersCount}})</span></span>\n      </li>\n    </ul>\n    <div class=\"tab-content\" [ngClass]=\"{'is-active': activeTab === 0}\">\n      <prs-mobile-items-list [items]=\"person.interests\"></prs-mobile-items-list>\n    </div>\n    <div class=\"tab-content\" id=\"tb-goals\" [ngClass]=\"{'is-active': activeTab === 1}\">\n      <prs-mobile-items-list [items]=\"person.goals\"></prs-mobile-items-list>\n    </div>\n    <div class=\"tab-content\" id=\"tb-offers\" [ngClass]=\"{'is-active': activeTab === 2}\">\n      <prs-mobile-items-list [items]=\"person.offers\"></prs-mobile-items-list>\n    </div>\n  </div>\n  <div class=\"profile-connections profile-box\">\n    <prs-mobile-connections-list [items]=\"friendsPreview\" [count]=\"friendsTotalCount\"></prs-mobile-connections-list>\n  </div>\n  <a class=\"profile-link profile-box\">\n    <div class=\"layout layout--small layout--middle\">\n      <div class=\"layout__item 4/5\"> <span class=\"profile-titleline\">Likes\n        <span class=\"profile-titleline__value\">({{person.likesCount}})</span> <span class=\"profile-titleline__subvalue\">&#8211; {{person.likesMutualCount}} mutual</span>\n        </span>\n      </div>\n      <div class=\"layout__item 1/5 text-center\">\n        <svg role=\"img\" class=\"icon \">\n          <use xlink:href=\"/static/assets/icons/icons.svg#icon-arrow_swipe_right\"></use>\n        </svg>\n      </div>\n    </div>\n  </a>\n</div>\n"

/***/ },

/***/ 1325:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*! Hammer.JS - v2.0.7 - 2016-04-22
	 * http://hammerjs.github.io/
	 *
	 * Copyright (c) 2016 Jorik Tangelder;
	 * Licensed under the MIT license */
	(function(window, document, exportName, undefined) {
	  'use strict';

	var VENDOR_PREFIXES = ['', 'webkit', 'Moz', 'MS', 'ms', 'o'];
	var TEST_ELEMENT = document.createElement('div');

	var TYPE_FUNCTION = 'function';

	var round = Math.round;
	var abs = Math.abs;
	var now = Date.now;

	/**
	 * set a timeout with a given scope
	 * @param {Function} fn
	 * @param {Number} timeout
	 * @param {Object} context
	 * @returns {number}
	 */
	function setTimeoutContext(fn, timeout, context) {
	    return setTimeout(bindFn(fn, context), timeout);
	}

	/**
	 * if the argument is an array, we want to execute the fn on each entry
	 * if it aint an array we don't want to do a thing.
	 * this is used by all the methods that accept a single and array argument.
	 * @param {*|Array} arg
	 * @param {String} fn
	 * @param {Object} [context]
	 * @returns {Boolean}
	 */
	function invokeArrayArg(arg, fn, context) {
	    if (Array.isArray(arg)) {
	        each(arg, context[fn], context);
	        return true;
	    }
	    return false;
	}

	/**
	 * walk objects and arrays
	 * @param {Object} obj
	 * @param {Function} iterator
	 * @param {Object} context
	 */
	function each(obj, iterator, context) {
	    var i;

	    if (!obj) {
	        return;
	    }

	    if (obj.forEach) {
	        obj.forEach(iterator, context);
	    } else if (obj.length !== undefined) {
	        i = 0;
	        while (i < obj.length) {
	            iterator.call(context, obj[i], i, obj);
	            i++;
	        }
	    } else {
	        for (i in obj) {
	            obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
	        }
	    }
	}

	/**
	 * wrap a method with a deprecation warning and stack trace
	 * @param {Function} method
	 * @param {String} name
	 * @param {String} message
	 * @returns {Function} A new function wrapping the supplied method.
	 */
	function deprecate(method, name, message) {
	    var deprecationMessage = 'DEPRECATED METHOD: ' + name + '\n' + message + ' AT \n';
	    return function() {
	        var e = new Error('get-stack-trace');
	        var stack = e && e.stack ? e.stack.replace(/^[^\(]+?[\n$]/gm, '')
	            .replace(/^\s+at\s+/gm, '')
	            .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@') : 'Unknown Stack Trace';

	        var log = window.console && (window.console.warn || window.console.log);
	        if (log) {
	            log.call(window.console, deprecationMessage, stack);
	        }
	        return method.apply(this, arguments);
	    };
	}

	/**
	 * extend object.
	 * means that properties in dest will be overwritten by the ones in src.
	 * @param {Object} target
	 * @param {...Object} objects_to_assign
	 * @returns {Object} target
	 */
	var assign;
	if (typeof Object.assign !== 'function') {
	    assign = function assign(target) {
	        if (target === undefined || target === null) {
	            throw new TypeError('Cannot convert undefined or null to object');
	        }

	        var output = Object(target);
	        for (var index = 1; index < arguments.length; index++) {
	            var source = arguments[index];
	            if (source !== undefined && source !== null) {
	                for (var nextKey in source) {
	                    if (source.hasOwnProperty(nextKey)) {
	                        output[nextKey] = source[nextKey];
	                    }
	                }
	            }
	        }
	        return output;
	    };
	} else {
	    assign = Object.assign;
	}

	/**
	 * extend object.
	 * means that properties in dest will be overwritten by the ones in src.
	 * @param {Object} dest
	 * @param {Object} src
	 * @param {Boolean} [merge=false]
	 * @returns {Object} dest
	 */
	var extend = deprecate(function extend(dest, src, merge) {
	    var keys = Object.keys(src);
	    var i = 0;
	    while (i < keys.length) {
	        if (!merge || (merge && dest[keys[i]] === undefined)) {
	            dest[keys[i]] = src[keys[i]];
	        }
	        i++;
	    }
	    return dest;
	}, 'extend', 'Use `assign`.');

	/**
	 * merge the values from src in the dest.
	 * means that properties that exist in dest will not be overwritten by src
	 * @param {Object} dest
	 * @param {Object} src
	 * @returns {Object} dest
	 */
	var merge = deprecate(function merge(dest, src) {
	    return extend(dest, src, true);
	}, 'merge', 'Use `assign`.');

	/**
	 * simple class inheritance
	 * @param {Function} child
	 * @param {Function} base
	 * @param {Object} [properties]
	 */
	function inherit(child, base, properties) {
	    var baseP = base.prototype,
	        childP;

	    childP = child.prototype = Object.create(baseP);
	    childP.constructor = child;
	    childP._super = baseP;

	    if (properties) {
	        assign(childP, properties);
	    }
	}

	/**
	 * simple function bind
	 * @param {Function} fn
	 * @param {Object} context
	 * @returns {Function}
	 */
	function bindFn(fn, context) {
	    return function boundFn() {
	        return fn.apply(context, arguments);
	    };
	}

	/**
	 * let a boolean value also be a function that must return a boolean
	 * this first item in args will be used as the context
	 * @param {Boolean|Function} val
	 * @param {Array} [args]
	 * @returns {Boolean}
	 */
	function boolOrFn(val, args) {
	    if (typeof val == TYPE_FUNCTION) {
	        return val.apply(args ? args[0] || undefined : undefined, args);
	    }
	    return val;
	}

	/**
	 * use the val2 when val1 is undefined
	 * @param {*} val1
	 * @param {*} val2
	 * @returns {*}
	 */
	function ifUndefined(val1, val2) {
	    return (val1 === undefined) ? val2 : val1;
	}

	/**
	 * addEventListener with multiple events at once
	 * @param {EventTarget} target
	 * @param {String} types
	 * @param {Function} handler
	 */
	function addEventListeners(target, types, handler) {
	    each(splitStr(types), function(type) {
	        target.addEventListener(type, handler, false);
	    });
	}

	/**
	 * removeEventListener with multiple events at once
	 * @param {EventTarget} target
	 * @param {String} types
	 * @param {Function} handler
	 */
	function removeEventListeners(target, types, handler) {
	    each(splitStr(types), function(type) {
	        target.removeEventListener(type, handler, false);
	    });
	}

	/**
	 * find if a node is in the given parent
	 * @method hasParent
	 * @param {HTMLElement} node
	 * @param {HTMLElement} parent
	 * @return {Boolean} found
	 */
	function hasParent(node, parent) {
	    while (node) {
	        if (node == parent) {
	            return true;
	        }
	        node = node.parentNode;
	    }
	    return false;
	}

	/**
	 * small indexOf wrapper
	 * @param {String} str
	 * @param {String} find
	 * @returns {Boolean} found
	 */
	function inStr(str, find) {
	    return str.indexOf(find) > -1;
	}

	/**
	 * split string on whitespace
	 * @param {String} str
	 * @returns {Array} words
	 */
	function splitStr(str) {
	    return str.trim().split(/\s+/g);
	}

	/**
	 * find if a array contains the object using indexOf or a simple polyFill
	 * @param {Array} src
	 * @param {String} find
	 * @param {String} [findByKey]
	 * @return {Boolean|Number} false when not found, or the index
	 */
	function inArray(src, find, findByKey) {
	    if (src.indexOf && !findByKey) {
	        return src.indexOf(find);
	    } else {
	        var i = 0;
	        while (i < src.length) {
	            if ((findByKey && src[i][findByKey] == find) || (!findByKey && src[i] === find)) {
	                return i;
	            }
	            i++;
	        }
	        return -1;
	    }
	}

	/**
	 * convert array-like objects to real arrays
	 * @param {Object} obj
	 * @returns {Array}
	 */
	function toArray(obj) {
	    return Array.prototype.slice.call(obj, 0);
	}

	/**
	 * unique array with objects based on a key (like 'id') or just by the array's value
	 * @param {Array} src [{id:1},{id:2},{id:1}]
	 * @param {String} [key]
	 * @param {Boolean} [sort=False]
	 * @returns {Array} [{id:1},{id:2}]
	 */
	function uniqueArray(src, key, sort) {
	    var results = [];
	    var values = [];
	    var i = 0;

	    while (i < src.length) {
	        var val = key ? src[i][key] : src[i];
	        if (inArray(values, val) < 0) {
	            results.push(src[i]);
	        }
	        values[i] = val;
	        i++;
	    }

	    if (sort) {
	        if (!key) {
	            results = results.sort();
	        } else {
	            results = results.sort(function sortUniqueArray(a, b) {
	                return a[key] > b[key];
	            });
	        }
	    }

	    return results;
	}

	/**
	 * get the prefixed property
	 * @param {Object} obj
	 * @param {String} property
	 * @returns {String|Undefined} prefixed
	 */
	function prefixed(obj, property) {
	    var prefix, prop;
	    var camelProp = property[0].toUpperCase() + property.slice(1);

	    var i = 0;
	    while (i < VENDOR_PREFIXES.length) {
	        prefix = VENDOR_PREFIXES[i];
	        prop = (prefix) ? prefix + camelProp : property;

	        if (prop in obj) {
	            return prop;
	        }
	        i++;
	    }
	    return undefined;
	}

	/**
	 * get a unique id
	 * @returns {number} uniqueId
	 */
	var _uniqueId = 1;
	function uniqueId() {
	    return _uniqueId++;
	}

	/**
	 * get the window object of an element
	 * @param {HTMLElement} element
	 * @returns {DocumentView|Window}
	 */
	function getWindowForElement(element) {
	    var doc = element.ownerDocument || element;
	    return (doc.defaultView || doc.parentWindow || window);
	}

	var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;

	var SUPPORT_TOUCH = ('ontouchstart' in window);
	var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined;
	var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

	var INPUT_TYPE_TOUCH = 'touch';
	var INPUT_TYPE_PEN = 'pen';
	var INPUT_TYPE_MOUSE = 'mouse';
	var INPUT_TYPE_KINECT = 'kinect';

	var COMPUTE_INTERVAL = 25;

	var INPUT_START = 1;
	var INPUT_MOVE = 2;
	var INPUT_END = 4;
	var INPUT_CANCEL = 8;

	var DIRECTION_NONE = 1;
	var DIRECTION_LEFT = 2;
	var DIRECTION_RIGHT = 4;
	var DIRECTION_UP = 8;
	var DIRECTION_DOWN = 16;

	var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
	var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
	var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

	var PROPS_XY = ['x', 'y'];
	var PROPS_CLIENT_XY = ['clientX', 'clientY'];

	/**
	 * create new input type manager
	 * @param {Manager} manager
	 * @param {Function} callback
	 * @returns {Input}
	 * @constructor
	 */
	function Input(manager, callback) {
	    var self = this;
	    this.manager = manager;
	    this.callback = callback;
	    this.element = manager.element;
	    this.target = manager.options.inputTarget;

	    // smaller wrapper around the handler, for the scope and the enabled state of the manager,
	    // so when disabled the input events are completely bypassed.
	    this.domHandler = function(ev) {
	        if (boolOrFn(manager.options.enable, [manager])) {
	            self.handler(ev);
	        }
	    };

	    this.init();

	}

	Input.prototype = {
	    /**
	     * should handle the inputEvent data and trigger the callback
	     * @virtual
	     */
	    handler: function() { },

	    /**
	     * bind the events
	     */
	    init: function() {
	        this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
	        this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
	        this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
	    },

	    /**
	     * unbind the events
	     */
	    destroy: function() {
	        this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
	        this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
	        this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
	    }
	};

	/**
	 * create new input type manager
	 * called by the Manager constructor
	 * @param {Hammer} manager
	 * @returns {Input}
	 */
	function createInputInstance(manager) {
	    var Type;
	    var inputClass = manager.options.inputClass;

	    if (inputClass) {
	        Type = inputClass;
	    } else if (SUPPORT_POINTER_EVENTS) {
	        Type = PointerEventInput;
	    } else if (SUPPORT_ONLY_TOUCH) {
	        Type = TouchInput;
	    } else if (!SUPPORT_TOUCH) {
	        Type = MouseInput;
	    } else {
	        Type = TouchMouseInput;
	    }
	    return new (Type)(manager, inputHandler);
	}

	/**
	 * handle input events
	 * @param {Manager} manager
	 * @param {String} eventType
	 * @param {Object} input
	 */
	function inputHandler(manager, eventType, input) {
	    var pointersLen = input.pointers.length;
	    var changedPointersLen = input.changedPointers.length;
	    var isFirst = (eventType & INPUT_START && (pointersLen - changedPointersLen === 0));
	    var isFinal = (eventType & (INPUT_END | INPUT_CANCEL) && (pointersLen - changedPointersLen === 0));

	    input.isFirst = !!isFirst;
	    input.isFinal = !!isFinal;

	    if (isFirst) {
	        manager.session = {};
	    }

	    // source event is the normalized value of the domEvents
	    // like 'touchstart, mouseup, pointerdown'
	    input.eventType = eventType;

	    // compute scale, rotation etc
	    computeInputData(manager, input);

	    // emit secret event
	    manager.emit('hammer.input', input);

	    manager.recognize(input);
	    manager.session.prevInput = input;
	}

	/**
	 * extend the data with some usable properties like scale, rotate, velocity etc
	 * @param {Object} manager
	 * @param {Object} input
	 */
	function computeInputData(manager, input) {
	    var session = manager.session;
	    var pointers = input.pointers;
	    var pointersLength = pointers.length;

	    // store the first input to calculate the distance and direction
	    if (!session.firstInput) {
	        session.firstInput = simpleCloneInputData(input);
	    }

	    // to compute scale and rotation we need to store the multiple touches
	    if (pointersLength > 1 && !session.firstMultiple) {
	        session.firstMultiple = simpleCloneInputData(input);
	    } else if (pointersLength === 1) {
	        session.firstMultiple = false;
	    }

	    var firstInput = session.firstInput;
	    var firstMultiple = session.firstMultiple;
	    var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;

	    var center = input.center = getCenter(pointers);
	    input.timeStamp = now();
	    input.deltaTime = input.timeStamp - firstInput.timeStamp;

	    input.angle = getAngle(offsetCenter, center);
	    input.distance = getDistance(offsetCenter, center);

	    computeDeltaXY(session, input);
	    input.offsetDirection = getDirection(input.deltaX, input.deltaY);

	    var overallVelocity = getVelocity(input.deltaTime, input.deltaX, input.deltaY);
	    input.overallVelocityX = overallVelocity.x;
	    input.overallVelocityY = overallVelocity.y;
	    input.overallVelocity = (abs(overallVelocity.x) > abs(overallVelocity.y)) ? overallVelocity.x : overallVelocity.y;

	    input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
	    input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;

	    input.maxPointers = !session.prevInput ? input.pointers.length : ((input.pointers.length >
	        session.prevInput.maxPointers) ? input.pointers.length : session.prevInput.maxPointers);

	    computeIntervalInputData(session, input);

	    // find the correct target
	    var target = manager.element;
	    if (hasParent(input.srcEvent.target, target)) {
	        target = input.srcEvent.target;
	    }
	    input.target = target;
	}

	function computeDeltaXY(session, input) {
	    var center = input.center;
	    var offset = session.offsetDelta || {};
	    var prevDelta = session.prevDelta || {};
	    var prevInput = session.prevInput || {};

	    if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
	        prevDelta = session.prevDelta = {
	            x: prevInput.deltaX || 0,
	            y: prevInput.deltaY || 0
	        };

	        offset = session.offsetDelta = {
	            x: center.x,
	            y: center.y
	        };
	    }

	    input.deltaX = prevDelta.x + (center.x - offset.x);
	    input.deltaY = prevDelta.y + (center.y - offset.y);
	}

	/**
	 * velocity is calculated every x ms
	 * @param {Object} session
	 * @param {Object} input
	 */
	function computeIntervalInputData(session, input) {
	    var last = session.lastInterval || input,
	        deltaTime = input.timeStamp - last.timeStamp,
	        velocity, velocityX, velocityY, direction;

	    if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined)) {
	        var deltaX = input.deltaX - last.deltaX;
	        var deltaY = input.deltaY - last.deltaY;

	        var v = getVelocity(deltaTime, deltaX, deltaY);
	        velocityX = v.x;
	        velocityY = v.y;
	        velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
	        direction = getDirection(deltaX, deltaY);

	        session.lastInterval = input;
	    } else {
	        // use latest velocity info if it doesn't overtake a minimum period
	        velocity = last.velocity;
	        velocityX = last.velocityX;
	        velocityY = last.velocityY;
	        direction = last.direction;
	    }

	    input.velocity = velocity;
	    input.velocityX = velocityX;
	    input.velocityY = velocityY;
	    input.direction = direction;
	}

	/**
	 * create a simple clone from the input used for storage of firstInput and firstMultiple
	 * @param {Object} input
	 * @returns {Object} clonedInputData
	 */
	function simpleCloneInputData(input) {
	    // make a simple copy of the pointers because we will get a reference if we don't
	    // we only need clientXY for the calculations
	    var pointers = [];
	    var i = 0;
	    while (i < input.pointers.length) {
	        pointers[i] = {
	            clientX: round(input.pointers[i].clientX),
	            clientY: round(input.pointers[i].clientY)
	        };
	        i++;
	    }

	    return {
	        timeStamp: now(),
	        pointers: pointers,
	        center: getCenter(pointers),
	        deltaX: input.deltaX,
	        deltaY: input.deltaY
	    };
	}

	/**
	 * get the center of all the pointers
	 * @param {Array} pointers
	 * @return {Object} center contains `x` and `y` properties
	 */
	function getCenter(pointers) {
	    var pointersLength = pointers.length;

	    // no need to loop when only one touch
	    if (pointersLength === 1) {
	        return {
	            x: round(pointers[0].clientX),
	            y: round(pointers[0].clientY)
	        };
	    }

	    var x = 0, y = 0, i = 0;
	    while (i < pointersLength) {
	        x += pointers[i].clientX;
	        y += pointers[i].clientY;
	        i++;
	    }

	    return {
	        x: round(x / pointersLength),
	        y: round(y / pointersLength)
	    };
	}

	/**
	 * calculate the velocity between two points. unit is in px per ms.
	 * @param {Number} deltaTime
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Object} velocity `x` and `y`
	 */
	function getVelocity(deltaTime, x, y) {
	    return {
	        x: x / deltaTime || 0,
	        y: y / deltaTime || 0
	    };
	}

	/**
	 * get the direction between two points
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Number} direction
	 */
	function getDirection(x, y) {
	    if (x === y) {
	        return DIRECTION_NONE;
	    }

	    if (abs(x) >= abs(y)) {
	        return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
	    }
	    return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
	}

	/**
	 * calculate the absolute distance between two points
	 * @param {Object} p1 {x, y}
	 * @param {Object} p2 {x, y}
	 * @param {Array} [props] containing x and y keys
	 * @return {Number} distance
	 */
	function getDistance(p1, p2, props) {
	    if (!props) {
	        props = PROPS_XY;
	    }
	    var x = p2[props[0]] - p1[props[0]],
	        y = p2[props[1]] - p1[props[1]];

	    return Math.sqrt((x * x) + (y * y));
	}

	/**
	 * calculate the angle between two coordinates
	 * @param {Object} p1
	 * @param {Object} p2
	 * @param {Array} [props] containing x and y keys
	 * @return {Number} angle
	 */
	function getAngle(p1, p2, props) {
	    if (!props) {
	        props = PROPS_XY;
	    }
	    var x = p2[props[0]] - p1[props[0]],
	        y = p2[props[1]] - p1[props[1]];
	    return Math.atan2(y, x) * 180 / Math.PI;
	}

	/**
	 * calculate the rotation degrees between two pointersets
	 * @param {Array} start array of pointers
	 * @param {Array} end array of pointers
	 * @return {Number} rotation
	 */
	function getRotation(start, end) {
	    return getAngle(end[1], end[0], PROPS_CLIENT_XY) + getAngle(start[1], start[0], PROPS_CLIENT_XY);
	}

	/**
	 * calculate the scale factor between two pointersets
	 * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
	 * @param {Array} start array of pointers
	 * @param {Array} end array of pointers
	 * @return {Number} scale
	 */
	function getScale(start, end) {
	    return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
	}

	var MOUSE_INPUT_MAP = {
	    mousedown: INPUT_START,
	    mousemove: INPUT_MOVE,
	    mouseup: INPUT_END
	};

	var MOUSE_ELEMENT_EVENTS = 'mousedown';
	var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';

	/**
	 * Mouse events input
	 * @constructor
	 * @extends Input
	 */
	function MouseInput() {
	    this.evEl = MOUSE_ELEMENT_EVENTS;
	    this.evWin = MOUSE_WINDOW_EVENTS;

	    this.pressed = false; // mousedown state

	    Input.apply(this, arguments);
	}

	inherit(MouseInput, Input, {
	    /**
	     * handle mouse events
	     * @param {Object} ev
	     */
	    handler: function MEhandler(ev) {
	        var eventType = MOUSE_INPUT_MAP[ev.type];

	        // on start we want to have the left mouse button down
	        if (eventType & INPUT_START && ev.button === 0) {
	            this.pressed = true;
	        }

	        if (eventType & INPUT_MOVE && ev.which !== 1) {
	            eventType = INPUT_END;
	        }

	        // mouse must be down
	        if (!this.pressed) {
	            return;
	        }

	        if (eventType & INPUT_END) {
	            this.pressed = false;
	        }

	        this.callback(this.manager, eventType, {
	            pointers: [ev],
	            changedPointers: [ev],
	            pointerType: INPUT_TYPE_MOUSE,
	            srcEvent: ev
	        });
	    }
	});

	var POINTER_INPUT_MAP = {
	    pointerdown: INPUT_START,
	    pointermove: INPUT_MOVE,
	    pointerup: INPUT_END,
	    pointercancel: INPUT_CANCEL,
	    pointerout: INPUT_CANCEL
	};

	// in IE10 the pointer types is defined as an enum
	var IE10_POINTER_TYPE_ENUM = {
	    2: INPUT_TYPE_TOUCH,
	    3: INPUT_TYPE_PEN,
	    4: INPUT_TYPE_MOUSE,
	    5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816
	};

	var POINTER_ELEMENT_EVENTS = 'pointerdown';
	var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel';

	// IE10 has prefixed support, and case-sensitive
	if (window.MSPointerEvent && !window.PointerEvent) {
	    POINTER_ELEMENT_EVENTS = 'MSPointerDown';
	    POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
	}

	/**
	 * Pointer events input
	 * @constructor
	 * @extends Input
	 */
	function PointerEventInput() {
	    this.evEl = POINTER_ELEMENT_EVENTS;
	    this.evWin = POINTER_WINDOW_EVENTS;

	    Input.apply(this, arguments);

	    this.store = (this.manager.session.pointerEvents = []);
	}

	inherit(PointerEventInput, Input, {
	    /**
	     * handle mouse events
	     * @param {Object} ev
	     */
	    handler: function PEhandler(ev) {
	        var store = this.store;
	        var removePointer = false;

	        var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
	        var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
	        var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;

	        var isTouch = (pointerType == INPUT_TYPE_TOUCH);

	        // get index of the event in the store
	        var storeIndex = inArray(store, ev.pointerId, 'pointerId');

	        // start and mouse must be down
	        if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
	            if (storeIndex < 0) {
	                store.push(ev);
	                storeIndex = store.length - 1;
	            }
	        } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
	            removePointer = true;
	        }

	        // it not found, so the pointer hasn't been down (so it's probably a hover)
	        if (storeIndex < 0) {
	            return;
	        }

	        // update the event in the store
	        store[storeIndex] = ev;

	        this.callback(this.manager, eventType, {
	            pointers: store,
	            changedPointers: [ev],
	            pointerType: pointerType,
	            srcEvent: ev
	        });

	        if (removePointer) {
	            // remove from the store
	            store.splice(storeIndex, 1);
	        }
	    }
	});

	var SINGLE_TOUCH_INPUT_MAP = {
	    touchstart: INPUT_START,
	    touchmove: INPUT_MOVE,
	    touchend: INPUT_END,
	    touchcancel: INPUT_CANCEL
	};

	var SINGLE_TOUCH_TARGET_EVENTS = 'touchstart';
	var SINGLE_TOUCH_WINDOW_EVENTS = 'touchstart touchmove touchend touchcancel';

	/**
	 * Touch events input
	 * @constructor
	 * @extends Input
	 */
	function SingleTouchInput() {
	    this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
	    this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
	    this.started = false;

	    Input.apply(this, arguments);
	}

	inherit(SingleTouchInput, Input, {
	    handler: function TEhandler(ev) {
	        var type = SINGLE_TOUCH_INPUT_MAP[ev.type];

	        // should we handle the touch events?
	        if (type === INPUT_START) {
	            this.started = true;
	        }

	        if (!this.started) {
	            return;
	        }

	        var touches = normalizeSingleTouches.call(this, ev, type);

	        // when done, reset the started state
	        if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
	            this.started = false;
	        }

	        this.callback(this.manager, type, {
	            pointers: touches[0],
	            changedPointers: touches[1],
	            pointerType: INPUT_TYPE_TOUCH,
	            srcEvent: ev
	        });
	    }
	});

	/**
	 * @this {TouchInput}
	 * @param {Object} ev
	 * @param {Number} type flag
	 * @returns {undefined|Array} [all, changed]
	 */
	function normalizeSingleTouches(ev, type) {
	    var all = toArray(ev.touches);
	    var changed = toArray(ev.changedTouches);

	    if (type & (INPUT_END | INPUT_CANCEL)) {
	        all = uniqueArray(all.concat(changed), 'identifier', true);
	    }

	    return [all, changed];
	}

	var TOUCH_INPUT_MAP = {
	    touchstart: INPUT_START,
	    touchmove: INPUT_MOVE,
	    touchend: INPUT_END,
	    touchcancel: INPUT_CANCEL
	};

	var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';

	/**
	 * Multi-user touch events input
	 * @constructor
	 * @extends Input
	 */
	function TouchInput() {
	    this.evTarget = TOUCH_TARGET_EVENTS;
	    this.targetIds = {};

	    Input.apply(this, arguments);
	}

	inherit(TouchInput, Input, {
	    handler: function MTEhandler(ev) {
	        var type = TOUCH_INPUT_MAP[ev.type];
	        var touches = getTouches.call(this, ev, type);
	        if (!touches) {
	            return;
	        }

	        this.callback(this.manager, type, {
	            pointers: touches[0],
	            changedPointers: touches[1],
	            pointerType: INPUT_TYPE_TOUCH,
	            srcEvent: ev
	        });
	    }
	});

	/**
	 * @this {TouchInput}
	 * @param {Object} ev
	 * @param {Number} type flag
	 * @returns {undefined|Array} [all, changed]
	 */
	function getTouches(ev, type) {
	    var allTouches = toArray(ev.touches);
	    var targetIds = this.targetIds;

	    // when there is only one touch, the process can be simplified
	    if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
	        targetIds[allTouches[0].identifier] = true;
	        return [allTouches, allTouches];
	    }

	    var i,
	        targetTouches,
	        changedTouches = toArray(ev.changedTouches),
	        changedTargetTouches = [],
	        target = this.target;

	    // get target touches from touches
	    targetTouches = allTouches.filter(function(touch) {
	        return hasParent(touch.target, target);
	    });

	    // collect touches
	    if (type === INPUT_START) {
	        i = 0;
	        while (i < targetTouches.length) {
	            targetIds[targetTouches[i].identifier] = true;
	            i++;
	        }
	    }

	    // filter changed touches to only contain touches that exist in the collected target ids
	    i = 0;
	    while (i < changedTouches.length) {
	        if (targetIds[changedTouches[i].identifier]) {
	            changedTargetTouches.push(changedTouches[i]);
	        }

	        // cleanup removed touches
	        if (type & (INPUT_END | INPUT_CANCEL)) {
	            delete targetIds[changedTouches[i].identifier];
	        }
	        i++;
	    }

	    if (!changedTargetTouches.length) {
	        return;
	    }

	    return [
	        // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
	        uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true),
	        changedTargetTouches
	    ];
	}

	/**
	 * Combined touch and mouse input
	 *
	 * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
	 * This because touch devices also emit mouse events while doing a touch.
	 *
	 * @constructor
	 * @extends Input
	 */

	var DEDUP_TIMEOUT = 2500;
	var DEDUP_DISTANCE = 25;

	function TouchMouseInput() {
	    Input.apply(this, arguments);

	    var handler = bindFn(this.handler, this);
	    this.touch = new TouchInput(this.manager, handler);
	    this.mouse = new MouseInput(this.manager, handler);

	    this.primaryTouch = null;
	    this.lastTouches = [];
	}

	inherit(TouchMouseInput, Input, {
	    /**
	     * handle mouse and touch events
	     * @param {Hammer} manager
	     * @param {String} inputEvent
	     * @param {Object} inputData
	     */
	    handler: function TMEhandler(manager, inputEvent, inputData) {
	        var isTouch = (inputData.pointerType == INPUT_TYPE_TOUCH),
	            isMouse = (inputData.pointerType == INPUT_TYPE_MOUSE);

	        if (isMouse && inputData.sourceCapabilities && inputData.sourceCapabilities.firesTouchEvents) {
	            return;
	        }

	        // when we're in a touch event, record touches to  de-dupe synthetic mouse event
	        if (isTouch) {
	            recordTouches.call(this, inputEvent, inputData);
	        } else if (isMouse && isSyntheticEvent.call(this, inputData)) {
	            return;
	        }

	        this.callback(manager, inputEvent, inputData);
	    },

	    /**
	     * remove the event listeners
	     */
	    destroy: function destroy() {
	        this.touch.destroy();
	        this.mouse.destroy();
	    }
	});

	function recordTouches(eventType, eventData) {
	    if (eventType & INPUT_START) {
	        this.primaryTouch = eventData.changedPointers[0].identifier;
	        setLastTouch.call(this, eventData);
	    } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
	        setLastTouch.call(this, eventData);
	    }
	}

	function setLastTouch(eventData) {
	    var touch = eventData.changedPointers[0];

	    if (touch.identifier === this.primaryTouch) {
	        var lastTouch = {x: touch.clientX, y: touch.clientY};
	        this.lastTouches.push(lastTouch);
	        var lts = this.lastTouches;
	        var removeLastTouch = function() {
	            var i = lts.indexOf(lastTouch);
	            if (i > -1) {
	                lts.splice(i, 1);
	            }
	        };
	        setTimeout(removeLastTouch, DEDUP_TIMEOUT);
	    }
	}

	function isSyntheticEvent(eventData) {
	    var x = eventData.srcEvent.clientX, y = eventData.srcEvent.clientY;
	    for (var i = 0; i < this.lastTouches.length; i++) {
	        var t = this.lastTouches[i];
	        var dx = Math.abs(x - t.x), dy = Math.abs(y - t.y);
	        if (dx <= DEDUP_DISTANCE && dy <= DEDUP_DISTANCE) {
	            return true;
	        }
	    }
	    return false;
	}

	var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
	var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;

	// magical touchAction value
	var TOUCH_ACTION_COMPUTE = 'compute';
	var TOUCH_ACTION_AUTO = 'auto';
	var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
	var TOUCH_ACTION_NONE = 'none';
	var TOUCH_ACTION_PAN_X = 'pan-x';
	var TOUCH_ACTION_PAN_Y = 'pan-y';
	var TOUCH_ACTION_MAP = getTouchActionProps();

	/**
	 * Touch Action
	 * sets the touchAction property or uses the js alternative
	 * @param {Manager} manager
	 * @param {String} value
	 * @constructor
	 */
	function TouchAction(manager, value) {
	    this.manager = manager;
	    this.set(value);
	}

	TouchAction.prototype = {
	    /**
	     * set the touchAction value on the element or enable the polyfill
	     * @param {String} value
	     */
	    set: function(value) {
	        // find out the touch-action by the event handlers
	        if (value == TOUCH_ACTION_COMPUTE) {
	            value = this.compute();
	        }

	        if (NATIVE_TOUCH_ACTION && this.manager.element.style && TOUCH_ACTION_MAP[value]) {
	            this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
	        }
	        this.actions = value.toLowerCase().trim();
	    },

	    /**
	     * just re-set the touchAction value
	     */
	    update: function() {
	        this.set(this.manager.options.touchAction);
	    },

	    /**
	     * compute the value for the touchAction property based on the recognizer's settings
	     * @returns {String} value
	     */
	    compute: function() {
	        var actions = [];
	        each(this.manager.recognizers, function(recognizer) {
	            if (boolOrFn(recognizer.options.enable, [recognizer])) {
	                actions = actions.concat(recognizer.getTouchAction());
	            }
	        });
	        return cleanTouchActions(actions.join(' '));
	    },

	    /**
	     * this method is called on each input cycle and provides the preventing of the browser behavior
	     * @param {Object} input
	     */
	    preventDefaults: function(input) {
	        var srcEvent = input.srcEvent;
	        var direction = input.offsetDirection;

	        // if the touch action did prevented once this session
	        if (this.manager.session.prevented) {
	            srcEvent.preventDefault();
	            return;
	        }

	        var actions = this.actions;
	        var hasNone = inStr(actions, TOUCH_ACTION_NONE) && !TOUCH_ACTION_MAP[TOUCH_ACTION_NONE];
	        var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_Y];
	        var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_X];

	        if (hasNone) {
	            //do not prevent defaults if this is a tap gesture

	            var isTapPointer = input.pointers.length === 1;
	            var isTapMovement = input.distance < 2;
	            var isTapTouchTime = input.deltaTime < 250;

	            if (isTapPointer && isTapMovement && isTapTouchTime) {
	                return;
	            }
	        }

	        if (hasPanX && hasPanY) {
	            // `pan-x pan-y` means browser handles all scrolling/panning, do not prevent
	            return;
	        }

	        if (hasNone ||
	            (hasPanY && direction & DIRECTION_HORIZONTAL) ||
	            (hasPanX && direction & DIRECTION_VERTICAL)) {
	            return this.preventSrc(srcEvent);
	        }
	    },

	    /**
	     * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
	     * @param {Object} srcEvent
	     */
	    preventSrc: function(srcEvent) {
	        this.manager.session.prevented = true;
	        srcEvent.preventDefault();
	    }
	};

	/**
	 * when the touchActions are collected they are not a valid value, so we need to clean things up. *
	 * @param {String} actions
	 * @returns {*}
	 */
	function cleanTouchActions(actions) {
	    // none
	    if (inStr(actions, TOUCH_ACTION_NONE)) {
	        return TOUCH_ACTION_NONE;
	    }

	    var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
	    var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);

	    // if both pan-x and pan-y are set (different recognizers
	    // for different directions, e.g. horizontal pan but vertical swipe?)
	    // we need none (as otherwise with pan-x pan-y combined none of these
	    // recognizers will work, since the browser would handle all panning
	    if (hasPanX && hasPanY) {
	        return TOUCH_ACTION_NONE;
	    }

	    // pan-x OR pan-y
	    if (hasPanX || hasPanY) {
	        return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
	    }

	    // manipulation
	    if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
	        return TOUCH_ACTION_MANIPULATION;
	    }

	    return TOUCH_ACTION_AUTO;
	}

	function getTouchActionProps() {
	    if (!NATIVE_TOUCH_ACTION) {
	        return false;
	    }
	    var touchMap = {};
	    var cssSupports = window.CSS && window.CSS.supports;
	    ['auto', 'manipulation', 'pan-y', 'pan-x', 'pan-x pan-y', 'none'].forEach(function(val) {

	        // If css.supports is not supported but there is native touch-action assume it supports
	        // all values. This is the case for IE 10 and 11.
	        touchMap[val] = cssSupports ? window.CSS.supports('touch-action', val) : true;
	    });
	    return touchMap;
	}

	/**
	 * Recognizer flow explained; *
	 * All recognizers have the initial state of POSSIBLE when a input session starts.
	 * The definition of a input session is from the first input until the last input, with all it's movement in it. *
	 * Example session for mouse-input: mousedown -> mousemove -> mouseup
	 *
	 * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
	 * which determines with state it should be.
	 *
	 * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
	 * POSSIBLE to give it another change on the next cycle.
	 *
	 *               Possible
	 *                  |
	 *            +-----+---------------+
	 *            |                     |
	 *      +-----+-----+               |
	 *      |           |               |
	 *   Failed      Cancelled          |
	 *                          +-------+------+
	 *                          |              |
	 *                      Recognized       Began
	 *                                         |
	 *                                      Changed
	 *                                         |
	 *                                  Ended/Recognized
	 */
	var STATE_POSSIBLE = 1;
	var STATE_BEGAN = 2;
	var STATE_CHANGED = 4;
	var STATE_ENDED = 8;
	var STATE_RECOGNIZED = STATE_ENDED;
	var STATE_CANCELLED = 16;
	var STATE_FAILED = 32;

	/**
	 * Recognizer
	 * Every recognizer needs to extend from this class.
	 * @constructor
	 * @param {Object} options
	 */
	function Recognizer(options) {
	    this.options = assign({}, this.defaults, options || {});

	    this.id = uniqueId();

	    this.manager = null;

	    // default is enable true
	    this.options.enable = ifUndefined(this.options.enable, true);

	    this.state = STATE_POSSIBLE;

	    this.simultaneous = {};
	    this.requireFail = [];
	}

	Recognizer.prototype = {
	    /**
	     * @virtual
	     * @type {Object}
	     */
	    defaults: {},

	    /**
	     * set options
	     * @param {Object} options
	     * @return {Recognizer}
	     */
	    set: function(options) {
	        assign(this.options, options);

	        // also update the touchAction, in case something changed about the directions/enabled state
	        this.manager && this.manager.touchAction.update();
	        return this;
	    },

	    /**
	     * recognize simultaneous with an other recognizer.
	     * @param {Recognizer} otherRecognizer
	     * @returns {Recognizer} this
	     */
	    recognizeWith: function(otherRecognizer) {
	        if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
	            return this;
	        }

	        var simultaneous = this.simultaneous;
	        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
	        if (!simultaneous[otherRecognizer.id]) {
	            simultaneous[otherRecognizer.id] = otherRecognizer;
	            otherRecognizer.recognizeWith(this);
	        }
	        return this;
	    },

	    /**
	     * drop the simultaneous link. it doesnt remove the link on the other recognizer.
	     * @param {Recognizer} otherRecognizer
	     * @returns {Recognizer} this
	     */
	    dropRecognizeWith: function(otherRecognizer) {
	        if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
	            return this;
	        }

	        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
	        delete this.simultaneous[otherRecognizer.id];
	        return this;
	    },

	    /**
	     * recognizer can only run when an other is failing
	     * @param {Recognizer} otherRecognizer
	     * @returns {Recognizer} this
	     */
	    requireFailure: function(otherRecognizer) {
	        if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
	            return this;
	        }

	        var requireFail = this.requireFail;
	        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
	        if (inArray(requireFail, otherRecognizer) === -1) {
	            requireFail.push(otherRecognizer);
	            otherRecognizer.requireFailure(this);
	        }
	        return this;
	    },

	    /**
	     * drop the requireFailure link. it does not remove the link on the other recognizer.
	     * @param {Recognizer} otherRecognizer
	     * @returns {Recognizer} this
	     */
	    dropRequireFailure: function(otherRecognizer) {
	        if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
	            return this;
	        }

	        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
	        var index = inArray(this.requireFail, otherRecognizer);
	        if (index > -1) {
	            this.requireFail.splice(index, 1);
	        }
	        return this;
	    },

	    /**
	     * has require failures boolean
	     * @returns {boolean}
	     */
	    hasRequireFailures: function() {
	        return this.requireFail.length > 0;
	    },

	    /**
	     * if the recognizer can recognize simultaneous with an other recognizer
	     * @param {Recognizer} otherRecognizer
	     * @returns {Boolean}
	     */
	    canRecognizeWith: function(otherRecognizer) {
	        return !!this.simultaneous[otherRecognizer.id];
	    },

	    /**
	     * You should use `tryEmit` instead of `emit` directly to check
	     * that all the needed recognizers has failed before emitting.
	     * @param {Object} input
	     */
	    emit: function(input) {
	        var self = this;
	        var state = this.state;

	        function emit(event) {
	            self.manager.emit(event, input);
	        }

	        // 'panstart' and 'panmove'
	        if (state < STATE_ENDED) {
	            emit(self.options.event + stateStr(state));
	        }

	        emit(self.options.event); // simple 'eventName' events

	        if (input.additionalEvent) { // additional event(panleft, panright, pinchin, pinchout...)
	            emit(input.additionalEvent);
	        }

	        // panend and pancancel
	        if (state >= STATE_ENDED) {
	            emit(self.options.event + stateStr(state));
	        }
	    },

	    /**
	     * Check that all the require failure recognizers has failed,
	     * if true, it emits a gesture event,
	     * otherwise, setup the state to FAILED.
	     * @param {Object} input
	     */
	    tryEmit: function(input) {
	        if (this.canEmit()) {
	            return this.emit(input);
	        }
	        // it's failing anyway
	        this.state = STATE_FAILED;
	    },

	    /**
	     * can we emit?
	     * @returns {boolean}
	     */
	    canEmit: function() {
	        var i = 0;
	        while (i < this.requireFail.length) {
	            if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
	                return false;
	            }
	            i++;
	        }
	        return true;
	    },

	    /**
	     * update the recognizer
	     * @param {Object} inputData
	     */
	    recognize: function(inputData) {
	        // make a new copy of the inputData
	        // so we can change the inputData without messing up the other recognizers
	        var inputDataClone = assign({}, inputData);

	        // is is enabled and allow recognizing?
	        if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
	            this.reset();
	            this.state = STATE_FAILED;
	            return;
	        }

	        // reset when we've reached the end
	        if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
	            this.state = STATE_POSSIBLE;
	        }

	        this.state = this.process(inputDataClone);

	        // the recognizer has recognized a gesture
	        // so trigger an event
	        if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
	            this.tryEmit(inputDataClone);
	        }
	    },

	    /**
	     * return the state of the recognizer
	     * the actual recognizing happens in this method
	     * @virtual
	     * @param {Object} inputData
	     * @returns {Const} STATE
	     */
	    process: function(inputData) { }, // jshint ignore:line

	    /**
	     * return the preferred touch-action
	     * @virtual
	     * @returns {Array}
	     */
	    getTouchAction: function() { },

	    /**
	     * called when the gesture isn't allowed to recognize
	     * like when another is being recognized or it is disabled
	     * @virtual
	     */
	    reset: function() { }
	};

	/**
	 * get a usable string, used as event postfix
	 * @param {Const} state
	 * @returns {String} state
	 */
	function stateStr(state) {
	    if (state & STATE_CANCELLED) {
	        return 'cancel';
	    } else if (state & STATE_ENDED) {
	        return 'end';
	    } else if (state & STATE_CHANGED) {
	        return 'move';
	    } else if (state & STATE_BEGAN) {
	        return 'start';
	    }
	    return '';
	}

	/**
	 * direction cons to string
	 * @param {Const} direction
	 * @returns {String}
	 */
	function directionStr(direction) {
	    if (direction == DIRECTION_DOWN) {
	        return 'down';
	    } else if (direction == DIRECTION_UP) {
	        return 'up';
	    } else if (direction == DIRECTION_LEFT) {
	        return 'left';
	    } else if (direction == DIRECTION_RIGHT) {
	        return 'right';
	    }
	    return '';
	}

	/**
	 * get a recognizer by name if it is bound to a manager
	 * @param {Recognizer|String} otherRecognizer
	 * @param {Recognizer} recognizer
	 * @returns {Recognizer}
	 */
	function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
	    var manager = recognizer.manager;
	    if (manager) {
	        return manager.get(otherRecognizer);
	    }
	    return otherRecognizer;
	}

	/**
	 * This recognizer is just used as a base for the simple attribute recognizers.
	 * @constructor
	 * @extends Recognizer
	 */
	function AttrRecognizer() {
	    Recognizer.apply(this, arguments);
	}

	inherit(AttrRecognizer, Recognizer, {
	    /**
	     * @namespace
	     * @memberof AttrRecognizer
	     */
	    defaults: {
	        /**
	         * @type {Number}
	         * @default 1
	         */
	        pointers: 1
	    },

	    /**
	     * Used to check if it the recognizer receives valid input, like input.distance > 10.
	     * @memberof AttrRecognizer
	     * @param {Object} input
	     * @returns {Boolean} recognized
	     */
	    attrTest: function(input) {
	        var optionPointers = this.options.pointers;
	        return optionPointers === 0 || input.pointers.length === optionPointers;
	    },

	    /**
	     * Process the input and return the state for the recognizer
	     * @memberof AttrRecognizer
	     * @param {Object} input
	     * @returns {*} State
	     */
	    process: function(input) {
	        var state = this.state;
	        var eventType = input.eventType;

	        var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
	        var isValid = this.attrTest(input);

	        // on cancel input and we've recognized before, return STATE_CANCELLED
	        if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
	            return state | STATE_CANCELLED;
	        } else if (isRecognized || isValid) {
	            if (eventType & INPUT_END) {
	                return state | STATE_ENDED;
	            } else if (!(state & STATE_BEGAN)) {
	                return STATE_BEGAN;
	            }
	            return state | STATE_CHANGED;
	        }
	        return STATE_FAILED;
	    }
	});

	/**
	 * Pan
	 * Recognized when the pointer is down and moved in the allowed direction.
	 * @constructor
	 * @extends AttrRecognizer
	 */
	function PanRecognizer() {
	    AttrRecognizer.apply(this, arguments);

	    this.pX = null;
	    this.pY = null;
	}

	inherit(PanRecognizer, AttrRecognizer, {
	    /**
	     * @namespace
	     * @memberof PanRecognizer
	     */
	    defaults: {
	        event: 'pan',
	        threshold: 10,
	        pointers: 1,
	        direction: DIRECTION_ALL
	    },

	    getTouchAction: function() {
	        var direction = this.options.direction;
	        var actions = [];
	        if (direction & DIRECTION_HORIZONTAL) {
	            actions.push(TOUCH_ACTION_PAN_Y);
	        }
	        if (direction & DIRECTION_VERTICAL) {
	            actions.push(TOUCH_ACTION_PAN_X);
	        }
	        return actions;
	    },

	    directionTest: function(input) {
	        var options = this.options;
	        var hasMoved = true;
	        var distance = input.distance;
	        var direction = input.direction;
	        var x = input.deltaX;
	        var y = input.deltaY;

	        // lock to axis?
	        if (!(direction & options.direction)) {
	            if (options.direction & DIRECTION_HORIZONTAL) {
	                direction = (x === 0) ? DIRECTION_NONE : (x < 0) ? DIRECTION_LEFT : DIRECTION_RIGHT;
	                hasMoved = x != this.pX;
	                distance = Math.abs(input.deltaX);
	            } else {
	                direction = (y === 0) ? DIRECTION_NONE : (y < 0) ? DIRECTION_UP : DIRECTION_DOWN;
	                hasMoved = y != this.pY;
	                distance = Math.abs(input.deltaY);
	            }
	        }
	        input.direction = direction;
	        return hasMoved && distance > options.threshold && direction & options.direction;
	    },

	    attrTest: function(input) {
	        return AttrRecognizer.prototype.attrTest.call(this, input) &&
	            (this.state & STATE_BEGAN || (!(this.state & STATE_BEGAN) && this.directionTest(input)));
	    },

	    emit: function(input) {

	        this.pX = input.deltaX;
	        this.pY = input.deltaY;

	        var direction = directionStr(input.direction);

	        if (direction) {
	            input.additionalEvent = this.options.event + direction;
	        }
	        this._super.emit.call(this, input);
	    }
	});

	/**
	 * Pinch
	 * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
	 * @constructor
	 * @extends AttrRecognizer
	 */
	function PinchRecognizer() {
	    AttrRecognizer.apply(this, arguments);
	}

	inherit(PinchRecognizer, AttrRecognizer, {
	    /**
	     * @namespace
	     * @memberof PinchRecognizer
	     */
	    defaults: {
	        event: 'pinch',
	        threshold: 0,
	        pointers: 2
	    },

	    getTouchAction: function() {
	        return [TOUCH_ACTION_NONE];
	    },

	    attrTest: function(input) {
	        return this._super.attrTest.call(this, input) &&
	            (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
	    },

	    emit: function(input) {
	        if (input.scale !== 1) {
	            var inOut = input.scale < 1 ? 'in' : 'out';
	            input.additionalEvent = this.options.event + inOut;
	        }
	        this._super.emit.call(this, input);
	    }
	});

	/**
	 * Press
	 * Recognized when the pointer is down for x ms without any movement.
	 * @constructor
	 * @extends Recognizer
	 */
	function PressRecognizer() {
	    Recognizer.apply(this, arguments);

	    this._timer = null;
	    this._input = null;
	}

	inherit(PressRecognizer, Recognizer, {
	    /**
	     * @namespace
	     * @memberof PressRecognizer
	     */
	    defaults: {
	        event: 'press',
	        pointers: 1,
	        time: 251, // minimal time of the pointer to be pressed
	        threshold: 9 // a minimal movement is ok, but keep it low
	    },

	    getTouchAction: function() {
	        return [TOUCH_ACTION_AUTO];
	    },

	    process: function(input) {
	        var options = this.options;
	        var validPointers = input.pointers.length === options.pointers;
	        var validMovement = input.distance < options.threshold;
	        var validTime = input.deltaTime > options.time;

	        this._input = input;

	        // we only allow little movement
	        // and we've reached an end event, so a tap is possible
	        if (!validMovement || !validPointers || (input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime)) {
	            this.reset();
	        } else if (input.eventType & INPUT_START) {
	            this.reset();
	            this._timer = setTimeoutContext(function() {
	                this.state = STATE_RECOGNIZED;
	                this.tryEmit();
	            }, options.time, this);
	        } else if (input.eventType & INPUT_END) {
	            return STATE_RECOGNIZED;
	        }
	        return STATE_FAILED;
	    },

	    reset: function() {
	        clearTimeout(this._timer);
	    },

	    emit: function(input) {
	        if (this.state !== STATE_RECOGNIZED) {
	            return;
	        }

	        if (input && (input.eventType & INPUT_END)) {
	            this.manager.emit(this.options.event + 'up', input);
	        } else {
	            this._input.timeStamp = now();
	            this.manager.emit(this.options.event, this._input);
	        }
	    }
	});

	/**
	 * Rotate
	 * Recognized when two or more pointer are moving in a circular motion.
	 * @constructor
	 * @extends AttrRecognizer
	 */
	function RotateRecognizer() {
	    AttrRecognizer.apply(this, arguments);
	}

	inherit(RotateRecognizer, AttrRecognizer, {
	    /**
	     * @namespace
	     * @memberof RotateRecognizer
	     */
	    defaults: {
	        event: 'rotate',
	        threshold: 0,
	        pointers: 2
	    },

	    getTouchAction: function() {
	        return [TOUCH_ACTION_NONE];
	    },

	    attrTest: function(input) {
	        return this._super.attrTest.call(this, input) &&
	            (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
	    }
	});

	/**
	 * Swipe
	 * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
	 * @constructor
	 * @extends AttrRecognizer
	 */
	function SwipeRecognizer() {
	    AttrRecognizer.apply(this, arguments);
	}

	inherit(SwipeRecognizer, AttrRecognizer, {
	    /**
	     * @namespace
	     * @memberof SwipeRecognizer
	     */
	    defaults: {
	        event: 'swipe',
	        threshold: 10,
	        velocity: 0.3,
	        direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
	        pointers: 1
	    },

	    getTouchAction: function() {
	        return PanRecognizer.prototype.getTouchAction.call(this);
	    },

	    attrTest: function(input) {
	        var direction = this.options.direction;
	        var velocity;

	        if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
	            velocity = input.overallVelocity;
	        } else if (direction & DIRECTION_HORIZONTAL) {
	            velocity = input.overallVelocityX;
	        } else if (direction & DIRECTION_VERTICAL) {
	            velocity = input.overallVelocityY;
	        }

	        return this._super.attrTest.call(this, input) &&
	            direction & input.offsetDirection &&
	            input.distance > this.options.threshold &&
	            input.maxPointers == this.options.pointers &&
	            abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
	    },

	    emit: function(input) {
	        var direction = directionStr(input.offsetDirection);
	        if (direction) {
	            this.manager.emit(this.options.event + direction, input);
	        }

	        this.manager.emit(this.options.event, input);
	    }
	});

	/**
	 * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
	 * between the given interval and position. The delay option can be used to recognize multi-taps without firing
	 * a single tap.
	 *
	 * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
	 * multi-taps being recognized.
	 * @constructor
	 * @extends Recognizer
	 */
	function TapRecognizer() {
	    Recognizer.apply(this, arguments);

	    // previous time and center,
	    // used for tap counting
	    this.pTime = false;
	    this.pCenter = false;

	    this._timer = null;
	    this._input = null;
	    this.count = 0;
	}

	inherit(TapRecognizer, Recognizer, {
	    /**
	     * @namespace
	     * @memberof PinchRecognizer
	     */
	    defaults: {
	        event: 'tap',
	        pointers: 1,
	        taps: 1,
	        interval: 300, // max time between the multi-tap taps
	        time: 250, // max time of the pointer to be down (like finger on the screen)
	        threshold: 9, // a minimal movement is ok, but keep it low
	        posThreshold: 10 // a multi-tap can be a bit off the initial position
	    },

	    getTouchAction: function() {
	        return [TOUCH_ACTION_MANIPULATION];
	    },

	    process: function(input) {
	        var options = this.options;

	        var validPointers = input.pointers.length === options.pointers;
	        var validMovement = input.distance < options.threshold;
	        var validTouchTime = input.deltaTime < options.time;

	        this.reset();

	        if ((input.eventType & INPUT_START) && (this.count === 0)) {
	            return this.failTimeout();
	        }

	        // we only allow little movement
	        // and we've reached an end event, so a tap is possible
	        if (validMovement && validTouchTime && validPointers) {
	            if (input.eventType != INPUT_END) {
	                return this.failTimeout();
	            }

	            var validInterval = this.pTime ? (input.timeStamp - this.pTime < options.interval) : true;
	            var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;

	            this.pTime = input.timeStamp;
	            this.pCenter = input.center;

	            if (!validMultiTap || !validInterval) {
	                this.count = 1;
	            } else {
	                this.count += 1;
	            }

	            this._input = input;

	            // if tap count matches we have recognized it,
	            // else it has began recognizing...
	            var tapCount = this.count % options.taps;
	            if (tapCount === 0) {
	                // no failing requirements, immediately trigger the tap event
	                // or wait as long as the multitap interval to trigger
	                if (!this.hasRequireFailures()) {
	                    return STATE_RECOGNIZED;
	                } else {
	                    this._timer = setTimeoutContext(function() {
	                        this.state = STATE_RECOGNIZED;
	                        this.tryEmit();
	                    }, options.interval, this);
	                    return STATE_BEGAN;
	                }
	            }
	        }
	        return STATE_FAILED;
	    },

	    failTimeout: function() {
	        this._timer = setTimeoutContext(function() {
	            this.state = STATE_FAILED;
	        }, this.options.interval, this);
	        return STATE_FAILED;
	    },

	    reset: function() {
	        clearTimeout(this._timer);
	    },

	    emit: function() {
	        if (this.state == STATE_RECOGNIZED) {
	            this._input.tapCount = this.count;
	            this.manager.emit(this.options.event, this._input);
	        }
	    }
	});

	/**
	 * Simple way to create a manager with a default set of recognizers.
	 * @param {HTMLElement} element
	 * @param {Object} [options]
	 * @constructor
	 */
	function Hammer(element, options) {
	    options = options || {};
	    options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
	    return new Manager(element, options);
	}

	/**
	 * @const {string}
	 */
	Hammer.VERSION = '2.0.7';

	/**
	 * default settings
	 * @namespace
	 */
	Hammer.defaults = {
	    /**
	     * set if DOM events are being triggered.
	     * But this is slower and unused by simple implementations, so disabled by default.
	     * @type {Boolean}
	     * @default false
	     */
	    domEvents: false,

	    /**
	     * The value for the touchAction property/fallback.
	     * When set to `compute` it will magically set the correct value based on the added recognizers.
	     * @type {String}
	     * @default compute
	     */
	    touchAction: TOUCH_ACTION_COMPUTE,

	    /**
	     * @type {Boolean}
	     * @default true
	     */
	    enable: true,

	    /**
	     * EXPERIMENTAL FEATURE -- can be removed/changed
	     * Change the parent input target element.
	     * If Null, then it is being set the to main element.
	     * @type {Null|EventTarget}
	     * @default null
	     */
	    inputTarget: null,

	    /**
	     * force an input class
	     * @type {Null|Function}
	     * @default null
	     */
	    inputClass: null,

	    /**
	     * Default recognizer setup when calling `Hammer()`
	     * When creating a new Manager these will be skipped.
	     * @type {Array}
	     */
	    preset: [
	        // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
	        [RotateRecognizer, {enable: false}],
	        [PinchRecognizer, {enable: false}, ['rotate']],
	        [SwipeRecognizer, {direction: DIRECTION_HORIZONTAL}],
	        [PanRecognizer, {direction: DIRECTION_HORIZONTAL}, ['swipe']],
	        [TapRecognizer],
	        [TapRecognizer, {event: 'doubletap', taps: 2}, ['tap']],
	        [PressRecognizer]
	    ],

	    /**
	     * Some CSS properties can be used to improve the working of Hammer.
	     * Add them to this method and they will be set when creating a new Manager.
	     * @namespace
	     */
	    cssProps: {
	        /**
	         * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
	         * @type {String}
	         * @default 'none'
	         */
	        userSelect: 'none',

	        /**
	         * Disable the Windows Phone grippers when pressing an element.
	         * @type {String}
	         * @default 'none'
	         */
	        touchSelect: 'none',

	        /**
	         * Disables the default callout shown when you touch and hold a touch target.
	         * On iOS, when you touch and hold a touch target such as a link, Safari displays
	         * a callout containing information about the link. This property allows you to disable that callout.
	         * @type {String}
	         * @default 'none'
	         */
	        touchCallout: 'none',

	        /**
	         * Specifies whether zooming is enabled. Used by IE10>
	         * @type {String}
	         * @default 'none'
	         */
	        contentZooming: 'none',

	        /**
	         * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
	         * @type {String}
	         * @default 'none'
	         */
	        userDrag: 'none',

	        /**
	         * Overrides the highlight color shown when the user taps a link or a JavaScript
	         * clickable element in iOS. This property obeys the alpha value, if specified.
	         * @type {String}
	         * @default 'rgba(0,0,0,0)'
	         */
	        tapHighlightColor: 'rgba(0,0,0,0)'
	    }
	};

	var STOP = 1;
	var FORCED_STOP = 2;

	/**
	 * Manager
	 * @param {HTMLElement} element
	 * @param {Object} [options]
	 * @constructor
	 */
	function Manager(element, options) {
	    this.options = assign({}, Hammer.defaults, options || {});

	    this.options.inputTarget = this.options.inputTarget || element;

	    this.handlers = {};
	    this.session = {};
	    this.recognizers = [];
	    this.oldCssProps = {};

	    this.element = element;
	    this.input = createInputInstance(this);
	    this.touchAction = new TouchAction(this, this.options.touchAction);

	    toggleCssProps(this, true);

	    each(this.options.recognizers, function(item) {
	        var recognizer = this.add(new (item[0])(item[1]));
	        item[2] && recognizer.recognizeWith(item[2]);
	        item[3] && recognizer.requireFailure(item[3]);
	    }, this);
	}

	Manager.prototype = {
	    /**
	     * set options
	     * @param {Object} options
	     * @returns {Manager}
	     */
	    set: function(options) {
	        assign(this.options, options);

	        // Options that need a little more setup
	        if (options.touchAction) {
	            this.touchAction.update();
	        }
	        if (options.inputTarget) {
	            // Clean up existing event listeners and reinitialize
	            this.input.destroy();
	            this.input.target = options.inputTarget;
	            this.input.init();
	        }
	        return this;
	    },

	    /**
	     * stop recognizing for this session.
	     * This session will be discarded, when a new [input]start event is fired.
	     * When forced, the recognizer cycle is stopped immediately.
	     * @param {Boolean} [force]
	     */
	    stop: function(force) {
	        this.session.stopped = force ? FORCED_STOP : STOP;
	    },

	    /**
	     * run the recognizers!
	     * called by the inputHandler function on every movement of the pointers (touches)
	     * it walks through all the recognizers and tries to detect the gesture that is being made
	     * @param {Object} inputData
	     */
	    recognize: function(inputData) {
	        var session = this.session;
	        if (session.stopped) {
	            return;
	        }

	        // run the touch-action polyfill
	        this.touchAction.preventDefaults(inputData);

	        var recognizer;
	        var recognizers = this.recognizers;

	        // this holds the recognizer that is being recognized.
	        // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
	        // if no recognizer is detecting a thing, it is set to `null`
	        var curRecognizer = session.curRecognizer;

	        // reset when the last recognizer is recognized
	        // or when we're in a new session
	        if (!curRecognizer || (curRecognizer && curRecognizer.state & STATE_RECOGNIZED)) {
	            curRecognizer = session.curRecognizer = null;
	        }

	        var i = 0;
	        while (i < recognizers.length) {
	            recognizer = recognizers[i];

	            // find out if we are allowed try to recognize the input for this one.
	            // 1.   allow if the session is NOT forced stopped (see the .stop() method)
	            // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
	            //      that is being recognized.
	            // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
	            //      this can be setup with the `recognizeWith()` method on the recognizer.
	            if (session.stopped !== FORCED_STOP && ( // 1
	                    !curRecognizer || recognizer == curRecognizer || // 2
	                    recognizer.canRecognizeWith(curRecognizer))) { // 3
	                recognizer.recognize(inputData);
	            } else {
	                recognizer.reset();
	            }

	            // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
	            // current active recognizer. but only if we don't already have an active recognizer
	            if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
	                curRecognizer = session.curRecognizer = recognizer;
	            }
	            i++;
	        }
	    },

	    /**
	     * get a recognizer by its event name.
	     * @param {Recognizer|String} recognizer
	     * @returns {Recognizer|Null}
	     */
	    get: function(recognizer) {
	        if (recognizer instanceof Recognizer) {
	            return recognizer;
	        }

	        var recognizers = this.recognizers;
	        for (var i = 0; i < recognizers.length; i++) {
	            if (recognizers[i].options.event == recognizer) {
	                return recognizers[i];
	            }
	        }
	        return null;
	    },

	    /**
	     * add a recognizer to the manager
	     * existing recognizers with the same event name will be removed
	     * @param {Recognizer} recognizer
	     * @returns {Recognizer|Manager}
	     */
	    add: function(recognizer) {
	        if (invokeArrayArg(recognizer, 'add', this)) {
	            return this;
	        }

	        // remove existing
	        var existing = this.get(recognizer.options.event);
	        if (existing) {
	            this.remove(existing);
	        }

	        this.recognizers.push(recognizer);
	        recognizer.manager = this;

	        this.touchAction.update();
	        return recognizer;
	    },

	    /**
	     * remove a recognizer by name or instance
	     * @param {Recognizer|String} recognizer
	     * @returns {Manager}
	     */
	    remove: function(recognizer) {
	        if (invokeArrayArg(recognizer, 'remove', this)) {
	            return this;
	        }

	        recognizer = this.get(recognizer);

	        // let's make sure this recognizer exists
	        if (recognizer) {
	            var recognizers = this.recognizers;
	            var index = inArray(recognizers, recognizer);

	            if (index !== -1) {
	                recognizers.splice(index, 1);
	                this.touchAction.update();
	            }
	        }

	        return this;
	    },

	    /**
	     * bind event
	     * @param {String} events
	     * @param {Function} handler
	     * @returns {EventEmitter} this
	     */
	    on: function(events, handler) {
	        if (events === undefined) {
	            return;
	        }
	        if (handler === undefined) {
	            return;
	        }

	        var handlers = this.handlers;
	        each(splitStr(events), function(event) {
	            handlers[event] = handlers[event] || [];
	            handlers[event].push(handler);
	        });
	        return this;
	    },

	    /**
	     * unbind event, leave emit blank to remove all handlers
	     * @param {String} events
	     * @param {Function} [handler]
	     * @returns {EventEmitter} this
	     */
	    off: function(events, handler) {
	        if (events === undefined) {
	            return;
	        }

	        var handlers = this.handlers;
	        each(splitStr(events), function(event) {
	            if (!handler) {
	                delete handlers[event];
	            } else {
	                handlers[event] && handlers[event].splice(inArray(handlers[event], handler), 1);
	            }
	        });
	        return this;
	    },

	    /**
	     * emit event to the listeners
	     * @param {String} event
	     * @param {Object} data
	     */
	    emit: function(event, data) {
	        // we also want to trigger dom events
	        if (this.options.domEvents) {
	            triggerDomEvent(event, data);
	        }

	        // no handlers, so skip it all
	        var handlers = this.handlers[event] && this.handlers[event].slice();
	        if (!handlers || !handlers.length) {
	            return;
	        }

	        data.type = event;
	        data.preventDefault = function() {
	            data.srcEvent.preventDefault();
	        };

	        var i = 0;
	        while (i < handlers.length) {
	            handlers[i](data);
	            i++;
	        }
	    },

	    /**
	     * destroy the manager and unbinds all events
	     * it doesn't unbind dom events, that is the user own responsibility
	     */
	    destroy: function() {
	        this.element && toggleCssProps(this, false);

	        this.handlers = {};
	        this.session = {};
	        this.input.destroy();
	        this.element = null;
	    }
	};

	/**
	 * add/remove the css properties as defined in manager.options.cssProps
	 * @param {Manager} manager
	 * @param {Boolean} add
	 */
	function toggleCssProps(manager, add) {
	    var element = manager.element;
	    if (!element.style) {
	        return;
	    }
	    var prop;
	    each(manager.options.cssProps, function(value, name) {
	        prop = prefixed(element.style, name);
	        if (add) {
	            manager.oldCssProps[prop] = element.style[prop];
	            element.style[prop] = value;
	        } else {
	            element.style[prop] = manager.oldCssProps[prop] || '';
	        }
	    });
	    if (!add) {
	        manager.oldCssProps = {};
	    }
	}

	/**
	 * trigger dom event
	 * @param {String} event
	 * @param {Object} data
	 */
	function triggerDomEvent(event, data) {
	    var gestureEvent = document.createEvent('Event');
	    gestureEvent.initEvent(event, true, true);
	    gestureEvent.gesture = data;
	    data.target.dispatchEvent(gestureEvent);
	}

	assign(Hammer, {
	    INPUT_START: INPUT_START,
	    INPUT_MOVE: INPUT_MOVE,
	    INPUT_END: INPUT_END,
	    INPUT_CANCEL: INPUT_CANCEL,

	    STATE_POSSIBLE: STATE_POSSIBLE,
	    STATE_BEGAN: STATE_BEGAN,
	    STATE_CHANGED: STATE_CHANGED,
	    STATE_ENDED: STATE_ENDED,
	    STATE_RECOGNIZED: STATE_RECOGNIZED,
	    STATE_CANCELLED: STATE_CANCELLED,
	    STATE_FAILED: STATE_FAILED,

	    DIRECTION_NONE: DIRECTION_NONE,
	    DIRECTION_LEFT: DIRECTION_LEFT,
	    DIRECTION_RIGHT: DIRECTION_RIGHT,
	    DIRECTION_UP: DIRECTION_UP,
	    DIRECTION_DOWN: DIRECTION_DOWN,
	    DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
	    DIRECTION_VERTICAL: DIRECTION_VERTICAL,
	    DIRECTION_ALL: DIRECTION_ALL,

	    Manager: Manager,
	    Input: Input,
	    TouchAction: TouchAction,

	    TouchInput: TouchInput,
	    MouseInput: MouseInput,
	    PointerEventInput: PointerEventInput,
	    TouchMouseInput: TouchMouseInput,
	    SingleTouchInput: SingleTouchInput,

	    Recognizer: Recognizer,
	    AttrRecognizer: AttrRecognizer,
	    Tap: TapRecognizer,
	    Pan: PanRecognizer,
	    Swipe: SwipeRecognizer,
	    Pinch: PinchRecognizer,
	    Rotate: RotateRecognizer,
	    Press: PressRecognizer,

	    on: addEventListeners,
	    off: removeEventListeners,
	    each: each,
	    merge: merge,
	    extend: extend,
	    assign: assign,
	    inherit: inherit,
	    bindFn: bindFn,
	    prefixed: prefixed
	});

	// this prevents errors when Hammer is loaded in the presence of an AMD
	//  style loader but by script tag, not by the loader.
	var freeGlobal = (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : {})); // jshint ignore:line
	freeGlobal.Hammer = Hammer;

	if (true) {
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	        return Hammer;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (typeof module != 'undefined' && module.exports) {
	    module.exports = Hammer;
	} else {
	    window[exportName] = Hammer;
	}

	})(window, document, 'Hammer');


/***/ }

});
//# sourceMappingURL=main-mobile.map