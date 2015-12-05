/// <reference path="../../typings/_custom.d.ts" />

import {Directive, ElementRef, Inject, EventEmitter} from 'angular2/angular2';
import {DateUtil} from '../core/util';

// let timepicker = require('timepicker');

declare var jQuery: any;

@Directive({
  selector: '[timepicker]',
  outputs: ['selectedValue'],
  properties: ['value: timepicker']
})
export class TimepickerDirective {
  el: ElementRef;
  selectedValue: EventEmitter<any> = new EventEmitter();
  value: any;

  constructor( @Inject(ElementRef) el: ElementRef) {
    this.el = el;

  }

  ngOnInit() {

    jQuery(this.el.nativeElement).pickatime({
      onSet: (context) => {
        let timeString = DateUtil.convertToHours(context.select);
        if (timeString !== 'NaN:NaN') {
          this.selectedValue.next(timeString);
        }
        else {
          this.selectedValue.next('Invalid time');
        }

      },
      onStart: () => {
        jQuery(this.el.nativeElement).pickatime('picker').set('select', parseInt(this.value, 10));
      }
    });

  }


  ngOnDestroy() {
    jQuery(this.el.nativeElement).pickatime('destroy');
  }




}
