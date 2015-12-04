/// <reference path="../../typings/_custom.d.ts" />

import {Directive, ElementRef, Inject, EventEmitter} from 'angular2/angular2';

// let datepicker = require('datepicker');

declare var jQuery: any;

@Directive({
  selector: '[datepicker]',
  outputs: ['selectedValue']
})
export class DatepickerDirective {
  el: ElementRef;
  selectedValue: EventEmitter<any> = new EventEmitter();

  constructor( @Inject(ElementRef) el: ElementRef) {
    this.el = el;

  }

  ngOnInit() {

    jQuery(this.el.nativeElement).pickadate({
      format: 'dd/mm/yyyy'
    });

  }


  ngOnDestroy() {
    jQuery(this.el.nativeElement).pickadate('destroy');
  }




}
