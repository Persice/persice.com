import {Directive, ElementRef, Inject, EventEmitter} from 'angular2/core';

let geocomplete = require('geocomplete');

declare var jQuery: any;
declare var google: any;

@Directive({
  selector: '[geocomplete]',
  outputs: ['selectedValue']
})
export class GeocompleteDirective {
  el: ElementRef;
  selectedValue: EventEmitter<any> = new EventEmitter();
  location;

  constructor( @Inject(ElementRef) el: ElementRef) {
    this.el = el;

  }

  ngOnInit() {

    jQuery(this.el.nativeElement).geocomplete({
      types: ['establishment', 'geocode']
    }).bind("geocode:result", (event, result) => {
      this.selectedValue.next(result);
    });

  }


  ngOnDestroy() {
    jQuery(this.el.nativeElement).geocomplete('destroy');
    jQuery('.pac-container').remove();
  }




}
