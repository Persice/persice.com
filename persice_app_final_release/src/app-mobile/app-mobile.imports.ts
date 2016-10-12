import { RouterModule } from '@angular/router';
import { RouterStoreModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { routes } from './app-mobile.routing';
import { StoreDevToolsModule } from '../common/dev-tools/store-devtools.module';
import { rootReducer } from '../common/reducers/index';
import { CustomConfig } from '../common/auth/config.service';
import { AuthModule } from '../common/auth/auth.module';

export class AuthConfig extends CustomConfig {
  defaultHeaders = { 'Content-Type': 'application/json' };
  cordova = 'enabled' === CORDOVA_BUILD ? true : false;
  providers = {
    facebook: {
      url: SERVER_URI + '/api/v2/accounts/facebook/login/',
      authorizationEndpoint: 'https://www.facebook.com/v2.7/dialog/oauth',
      redirectUri: SERVER_URI + '/public/close_popup/',
      clientId: FACEBOOK_ID,
      display: 'popup',
      scope: FACEBOOK_SCOPE.split(',')
    },
    twitter: {
      url: SERVER_URI + '/api/v2/accounts/twitter/connect/',
      authorizationEndpoint: 'https://api.twitter.com/oauth/authorize',
      redirectUri: SERVER_URI + '/public/close_popup/',
      unlinkUrl: SERVER_URI + '/api/v2/accounts/twitter/disconnect/'
    },
    linkedin: {
      clientId: LINKEDIN_ID,
      url: SERVER_URI + '/api/v2/accounts/linkedin/connect/',
      redirectUri: SERVER_URI + '/public/close_popup/',
      scope: [ 'r_basicprofile', 'rw_company_admin', 'r_emailaddress', 'w_share' ],
      scopeDelimiter: ',',
      state: 'ZjUV40DdytBHaLPj',
      unlinkUrl: SERVER_URI + '/api/v2/accounts/linkedin/disconnect/'
    }
  };
}

export const APP_MOBILE_IMPORTS = [
  RouterModule.forRoot(routes),
  RouterStoreModule.connectRouter(),
  StoreDevToolsModule,
  StoreModule.provideStore(rootReducer),
  AuthModule.getWithConfig(AuthConfig),
];

