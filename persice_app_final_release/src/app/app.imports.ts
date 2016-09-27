import { RouterModule } from '@angular/router';
import { RouterStoreModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { routes } from './app.routing';
import { StoreDevToolsModule } from '../common/dev-tools/store-devtools.module';
import { rootReducer } from '../common/reducers/index';
import { CustomConfig } from '../common/auth/config.service';
import { AuthModule } from '../common/auth/auth.module';

export const FACEBOOK_ID = '634990373263225'; //'633834406712155';
export const FACEBOOK_SCOPE = 'email,user_about_me,user_birthday,user_likes,user_friends,user_managed_groups,user_photos,user_work_history,user_religion_politics,user_hometown,user_location,user_events';
export const LINKEDIN_ID = '77x6ttwe3nhjen';

export class AuthConfig extends CustomConfig {
  defaultHeaders = { 'Content-Type': 'application/json' };
  providers = {
    facebook: {
      url: '/api/v2/accounts/facebook/login/',
      authorizationEndpoint: 'https://www.facebook.com/v2.7/dialog/oauth',
      redirectUri: window.location.origin + '/public/close_popup/',
      clientId: FACEBOOK_ID,
      display: 'popup',
      scope: FACEBOOK_SCOPE.split(',')
    },
    twitter: {
      url: '/api/v2/accounts/twitter/connect/',
      authorizationEndpoint: 'https://api.twitter.com/oauth/authorize',
      redirectUri: window.location.origin + '/public/close_popup/',
      unlinkUrl: '/api/v2/accounts/twitter/disconnect/'
    },
    linkedin: {
      clientId: LINKEDIN_ID,
      url: '/api/v2/accounts/linkedin/connect/',
      redirectUri: window.location.origin + '/public/close_popup/',
      scope: [ 'r_basicprofile', 'rw_company_admin', 'r_emailaddress', 'w_share' ],
      scopeDelimiter: ',',
      state: 'ZjUV40DdytBHaLPj',
      unlinkUrl: '/api/v2/accounts/linkedin/disconnect/'
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

