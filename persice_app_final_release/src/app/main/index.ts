import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './main.routing';
import { MainComponent } from './main.component';
import { MAIN_DECLARATIONS } from './main.declarations';
import { SharedModule } from '../shared.module';
import { LazyMapsAPILoader } from '../../common/map/lazy-maps-api-loader';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [],
  declarations: [
    MainComponent,
    MAIN_DECLARATIONS
  ],
  providers: [ LazyMapsAPILoader ],
})
export class MainModule {
}
