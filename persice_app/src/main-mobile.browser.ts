/*
 * Providers provided by Angular
 */
import { bootstrap } from '@angular/platform-browser-dynamic';
import { PLATFORM_PROVIDERS_MAIN_MOBILE } from './platform/browser';
import { ENV_PROVIDERS } from './platform/environment';
import { AppMobileComponent, APP_PROVIDERS } from './app-mobile';
/*
 * Platform and Environment
 * our providers/directives/pipes
 */

/**
 * RxJS Redux store and reducers
 */

/*
 * App Component
 * our top level component that holds all of our components
 */
/*
 * Bootstrap our Angular app with a top level component `App` and inject
 * our Services and Providers into Angular's dependency injection
 */
export function main(initialHmrState?: any): Promise<any> {

  return bootstrap(AppMobileComponent, [
    ...PLATFORM_PROVIDERS_MAIN_MOBILE,
    ...ENV_PROVIDERS,
    ...APP_PROVIDERS
  ])
    .catch(err => console.error(err));

}

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
if ('development' === ENV && HMR === true) {
  // activate hot module reload
  let ngHmr = require('angular2-hmr');

  ngHmr.hotModuleReplacement(main, module);

  // fix for closing remodal after hot reload
  jQuery('.remodal-overlay').remove();
  jQuery('.remodal-wrapper').remove();
} else {
  // bootstrap when documetn is ready
  document.addEventListener('DOMContentLoaded', () => main());
}
