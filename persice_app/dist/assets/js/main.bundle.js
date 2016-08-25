webpackJsonp([2],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/*
	 * Providers provided by Angular
	 */
	var platform_browser_dynamic_1 = __webpack_require__(316);
	var browser_1 = __webpack_require__(565);
	var environment_1 = __webpack_require__(566);
	var app_1 = __webpack_require__(511);
	/*
	 * Platform and Environment
	 * our providers/directives/pipes
	 */
	/*
	 * App Component
	 * our top level component that holds all of our components
	 */
	/*
	 * Bootstrap our Angular app with a top level component `App` and inject
	 * our Services and Providers into Angular's dependency injection
	 */
	function main(initialHmrState) {
	    return platform_browser_dynamic_1.bootstrap(app_1.AppComponent, browser_1.PLATFORM_PROVIDERS_MAIN.concat(environment_1.ENV_PROVIDERS, app_1.APP_PROVIDERS))
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
	    // fix for closing remodal after hot reload
	    jQuery('.remodal-overlay').remove();
	    jQuery('.remodal-wrapper').remove();
	}
	else {
	    // bootstrap when documetn is ready
	    document.addEventListener('DOMContentLoaded', function () { return main(); });
	}
	

/***/ }
]);
//# sourceMappingURL=main.map