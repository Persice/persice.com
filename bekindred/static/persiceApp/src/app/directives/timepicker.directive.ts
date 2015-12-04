/// <reference path="../../typings/_custom.d.ts" />

import {Directive, ElementRef, Inject, EventEmitter} from 'angular2/angular2';

// let timepicker = require('timepicker');

declare var jQuery: any;

@Directive({
  selector: '[timepicker]',
  outputs: ['selectedValue']
})
export class TimepickerDirective {
  el: ElementRef;
  selectedValue: EventEmitter<any> = new EventEmitter();

  constructor( @Inject(ElementRef) el: ElementRef) {
    this.el = el;

  }

  ngOnInit() {

    jQuery(this.el.nativeElement).pickatime();

  }


  ngOnDestroy() {
    jQuery(this.el.nativeElement).pickatime('destroy');
  }




}
