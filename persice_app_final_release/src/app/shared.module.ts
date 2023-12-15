import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollDirective } from '../common/directives/infinite-scroll.directive';
import { UrlDomainPipe } from '../common/pipes/url-domain.pipe';
import { MarkupPipe } from '../common/pipes/markup.pipe';
import { IgnoreMarkupPipe } from '../common/pipes/ignore_markup.pipe';
import { GenderPipe } from '../common/pipes/gender.pipe';
import { AutocompleteDirective } from '../common/directives/autocomplete.directive';
import { InfiniteScrollElementDirective } from '../common/directives/infinite-scroll-element.directive';
import { NumeralPipe } from '../common/pipes/numeral.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { DropdownDirective } from './shared/directives/dropdown.directive';
import { CropDirective } from './shared/directives/crop.directive';
import { RemodalDirective } from './shared/directives/remodal.directive';
import { CheckImageDirective } from './shared/directives/checkimage.directive';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { SelectDirective } from './shared/directives/select.directive';
import { NotificationComponent } from './shared/components/notification/notification.component';
import { DatepickerDirective } from './shared/directives/datepicker.directive';
import { TimepickerDirective } from './shared/directives/timepicker.directive';
import { SwiperDirective } from './shared/directives/swiper.directive';
import { DefaultImageDirective } from '../common/directives/default-image.directive';
import { SliderComponent } from './shared/components/slider/slider.component';
import { GeocompleteDirective } from './shared/directives/geocomplete.directive';
import { TimeAgoPipe } from '../common/pipes';
import { InfiniteScrollReverseDirective } from '../common/directives';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [ CommonModule ],
  declarations: [
    SliderComponent,
    AutocompleteDirective,
    DropdownDirective,
    CropDirective,
    RemodalDirective,
    CheckImageDirective,
    GeocompleteDirective,
    LoadingComponent,
    InfiniteScrollDirective,
    InfiniteScrollElementDirective,
    InfiniteScrollReverseDirective,
    SelectDirective,
    NotificationComponent,
    DatepickerDirective,
    TimepickerDirective,
    DefaultImageDirective,
    SwiperDirective,
    UrlDomainPipe,
    MarkupPipe,
    IgnoreMarkupPipe,
    GenderPipe,
    NumeralPipe,
    TimeAgoPipe

    // from mobile

  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule,
    SliderComponent,
    AutocompleteDirective,
    DropdownDirective,
    CropDirective,
    RemodalDirective,
    CheckImageDirective,
    GeocompleteDirective,
    LoadingComponent,
    InfiniteScrollDirective,
    InfiniteScrollElementDirective,
    InfiniteScrollReverseDirective,
    SelectDirective,
    NotificationComponent,
    DatepickerDirective,
    TimepickerDirective,
    DefaultImageDirective,
    SwiperDirective,
    UrlDomainPipe,
    MarkupPipe,
    IgnoreMarkupPipe,
    GenderPipe,
    NumeralPipe,
    TimeAgoPipe
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}