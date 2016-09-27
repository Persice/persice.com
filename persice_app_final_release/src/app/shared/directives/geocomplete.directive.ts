import { Directive, ElementRef, EventEmitter, Output, OnDestroy, AfterViewInit } from '@angular/core';
import { LazyMapsAPILoader } from '../../../common/map/lazy-maps-api-loader';

require('geocomplete');

@Directive({
  selector: '[geocomplete]'
})
export class GeocompleteDirective implements AfterViewInit, OnDestroy {
  @Output() selectedValue: EventEmitter<any> = new EventEmitter();
  location;
  instance;

  constructor(private el: ElementRef, private mapsApiLoader: LazyMapsAPILoader) { }

  ngAfterViewInit() {
    if (this.googleApiNotLoaded()) {
      this.mapsApiLoader.load().then(() => {
        this.loadAutocomplete();
      });
    } else {
      // google maps api is already loaded
      this.loadAutocomplete();
    }
  }

  ngOnDestroy() {
    if (!!this.instance) {
      jQuery(this.el.nativeElement).geocomplete('destroy');
      jQuery('.pac-container').remove();
    }

  }

  googleApiNotLoaded(): boolean {
    return !(<any>window).google || !(<any>window).google.maps;
  }

  private loadAutocomplete(): void {
    if (!this.instance) {
      this.instance = jQuery(this.el.nativeElement).geocomplete({
        types: [ 'establishment', 'geocode' ]
      }).bind('geocode:result', (event, result) => {
        this.selectedValue.emit(result);
      });

    }
  }

}
