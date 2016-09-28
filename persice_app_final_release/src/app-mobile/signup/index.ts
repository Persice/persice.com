import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './signup-mobile.routing';
import { SignupMobileComponent } from './signup-mobile.component';
import { SIGNUP_MOBILE_DECLARATIONS } from './signup-mobile.declarations';
import { SharedModule } from '../../app/shared.module';

@NgModule({
  imports: [ SharedModule, RouterModule.forChild(routes) ],
  providers: [],
  declarations: [
    SignupMobileComponent,
    SIGNUP_MOBILE_DECLARATIONS
  ],
  exports: []
})
export class SignupMobileModule {

}
