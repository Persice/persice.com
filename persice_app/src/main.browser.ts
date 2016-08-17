/*
 * Providers provided by Angular
 */
import { bootstrap } from '@angular/platform-browser-dynamic';
import { PLATFORM_PROVIDERS_MAIN } from './platform/browser';
import { ENV_PROVIDERS } from './platform/environment';
import { AppComponent, APP_PROVIDERS } from './app';
import { NG2_UI_AUTH_PROVIDERS } from 'ng2-ui-auth';
import { AuthGuard } from './app/auth.guard';
const FACEBOOK_ID = '634990373263225';

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
export function main(initialHmrState?: any): Promise<any> {

  return bootstrap(AppComponent, [
    ...PLATFORM_PROVIDERS_MAIN,
    ...ENV_PROVIDERS,
    ...APP_PROVIDERS,
    AuthGuard,
    NG2_UI_AUTH_PROVIDERS({
      tokenPrefix: 'persice',
      providers: {
        facebook: {
          clientId: FACEBOOK_ID,
          display: 'page',
          authorizationEndpoint: 'https://www.facebook.com/v2.6/dialog/oauth',
          scope: ["email", "user_about_me", "user_birthday", "user_likes", "user_friends", "user_managed_groups", "user_photos", "user_work_history", "user_religion_politics", "user_location"]
        },
      }
    })
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
