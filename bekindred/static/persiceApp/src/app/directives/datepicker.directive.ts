/// <reference path="../../typings/_custom.d.ts" />

import {Directive, ElementRef, Inject, EventEmitter} from 'angular2/angular2';
import {DateUtil} from '../core/util';

// let datepicker = require('datepicker');

declare var jQuery: any;

@Directive({
  selector: '[datepicker]',
  outputs: ['selectedValue'],
  properties: ['value: datepicker']
})
export class DatepickerDirective {
  el: ElementRef;
  selectedValue: EventEmitter<any> = new EventEmitter();
  value: any;

  constructor( @Inject(ElementRef) el: ElementRef) {
    this.el = el;

  }

  ngOnInit() {

    jQuery(this.el.nativeElement).pickadate({
      format: 'mm/dd/yyyy',
      formatSubmit: 'mm/dd/yyyy',
      onSet: (context) => {
        let dateString = DateUtil.convertFromUnixToDate(context.select / 1000);
        this.selectedValue.next(dateString);
      },
      onStart: () => {
        jQuery(this.el.nativeElement).pickadate('picker').set('select', parseInt(this.value, 10));
      }
    });

  }


  ngOnDestroy() {
    jQuery(this.el.nativeElement).pickadate('destroy');
  }




}
