import { NgModule } from '@angular/core';
import { SignupComponent } from './signup.component';
import { RouterModule } from '@angular/router';
import { routes } from './signup.routing';
import { SIGNUP_DECLARATIONS } from './signup.declarations';
import { SharedModule } from '../shared.module';

@NgModule({
  imports: [ SharedModule, RouterModule.forChild(routes) ],
  providers: [],
  declarations: [
    SignupComponent,
    SIGNUP_DECLARATIONS
  ],
  exports: []
})
export class SignupModule {

}
