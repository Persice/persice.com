/// <reference path="../../typings/_custom.d.ts" />

import {Directive, ElementRef, Inject} from 'angular2/angular2';

declare var jQuery: any;

@Directive({
  selector: '[remodal]',
  properties: [
    'show',
    'scroll',
    'infinite',
    'append',
    'arrows',
    'dots',
    'responsive',
    'breakpoint',
    'slidestoshow'
  ]
})
export class RemodalDirective {
  el: ElementRef;

  constructor( @Inject(ElementRef) el: ElementRef) {
    this.el = el;

  }

  afterViewInit() {
    let options = {
      hashTracking: false,
      closeOnOutsideClick: false
    };
    jQuery(this.el.nativeElement).remodal(options);

  }

  onDestroy() {
    jQuery(this.el.nativeElement).remodal().destroy();
  }
}
