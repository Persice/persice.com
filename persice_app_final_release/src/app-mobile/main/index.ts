import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './main-mobile.routing';
import { MainMobileComponent } from './main-mobile.component';
import { MAIN_MOBILE_DECLARATIONS } from './main-mobile.declarations';
import { SharedModule } from '../../app/shared.module';
@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [],
  declarations: [
    MainMobileComponent,
    MAIN_MOBILE_DECLARATIONS
  ],
  providers: [],
})
export class MainMobileModule {
}
