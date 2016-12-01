import { RouterModule } from '@angular/router';
import { RouterStoreModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { routes } from './app.routing';
import { StoreDevToolsModule } from '../common/dev-tools/store-devtools.module';
import { rootReducer } from '../common/reducers/index';
import { CustomConfig } from '../common/auth/config.service';
import { AuthModule } from '../common/auth/auth.module';

export class AuthConfig extends CustomConfig {
  defaultHeaders = { 'Content-Type': 'application/json' };
  providers = {
    facebook: {
      url: SERVER_URI + '/api/v2/accounts/facebook/login/?format=json',
      authorizationEndpoint: 'https://www.facebook.com/v2.7/dialog/oauth',
      redirectUri: SERVER_URI + '/public/close_popup/',
      clientId: FACEBOOK_ID,
      display: 'popup',
      scope: FACEBOOK_SCOPE.split(',')
    },
    twitter: {
      url: SERVER_URI + '/api/v2/accounts/twitter/connect/?format=json',
      authorizationEndpoint: 'https://api.twitter.com/oauth/authorize',
      redirectUri: SERVER_URI + '/public/close_popup/',
      unlinkUrl: SERVER_URI + '/api/v2/accounts/twitter/disconnect/?format=json'
    },
    linkedin: {
      clientId: LINKEDIN_ID,
      url: SERVER_URI + '/api/v2/accounts/linkedin/connect/?format=json',
      redirectUri: SERVER_URI + '/public/close_popup/',
      scope: [ 'r_basicprofile', 'rw_company_admin', 'r_emailaddress', 'w_share' ],
      scopeDelimiter: ',',
      state: 'ZjUV40DdytBHaLPj',
      unlinkUrl: SERVER_URI + '/api/v2/accounts/linkedin/disconnect/?format=json'
    }
  };
}

export const APP_IMPORTS = [
  RouterModule.forRoot(routes),
  RouterStoreModule.connectRouter(),
  StoreDevToolsModule,
  StoreModule.provideStore(rootReducer),
  AuthModule.getWithConfig(AuthConfig),
];

