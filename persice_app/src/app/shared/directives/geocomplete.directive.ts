import { Directive, ElementRef, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { MapsAPILoader } from '../../../common/google-map';

require('geocomplete');

declare var google: any;

@Directive({
  selector: '[geocomplete]'
})
export class GeocompleteDirective implements OnInit, OnDestroy {
  @Output() selectedValue: EventEmitter<any> = new EventEmitter();
  location;
  instance;

  constructor(private el: ElementRef, private _loader: MapsAPILoader) { }

  ngOnInit() {
    // lazy load google maps api
    if (!(typeof google === 'object' && typeof google.maps === 'object')) {
      this._loader.load().then(() => {
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

  private loadAutocomplete(): void {
    if (!this.instance) {
      this.instance = jQuery(this.el.nativeElement).geocomplete({
        types: ['establishment', 'geocode']
      }).bind('geocode:result', (event, result) => {
        this.selectedValue.emit(result);
      });

    }
  }

}
