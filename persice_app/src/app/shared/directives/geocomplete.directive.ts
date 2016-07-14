import { Directive, ElementRef, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { MapsAPILoader } from '../components/map/services/maps-api-loader/maps-api-loader';

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
        this.instance = jQuery(this.el.nativeElement).geocomplete({
          types: ['establishment', 'geocode']
        }).bind('geocode:result', (event, result) => {
          this.selectedValue.next(result);
        });
      });
    } else {
      // google maps api is already loaded
      this.instance = jQuery(this.el.nativeElement).geocomplete({
        types: ['establishment', 'geocode']
      }).bind('geocode:result', (event, result) => {
        this.selectedValue.next(result);
      });
    }

  }


  ngOnDestroy() {
    if (this.instance) {
      jQuery(this.el.nativeElement).geocomplete('destroy');
      jQuery('.pac-container').remove();
    }

  }


}
