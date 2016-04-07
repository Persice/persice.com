import {Directive, ElementRef, EventEmitter, AfterViewInit} from 'angular2/core';
import {DateUtil} from '../core';

declare var jQuery: any;

@Directive({
  selector: '[timepicker]',
  outputs: ['selectedValue'],
  properties: ['value: timepicker']
})
export class TimepickerDirective implements AfterViewInit {
  el: ElementRef;
  selectedValue: EventEmitter<any> = new EventEmitter();
  value: any;

  constructor(el: ElementRef)  {
    this.el = el;

  }

  ngAfterViewInit() {

    jQuery(this.el.nativeElement).pickatime({
      onSet: (context) => {
        let timeString = '';

        if ('object' === typeof context.select) {
          timeString = DateUtil.convertToHours(context.select.pick);
        }
        else {
          timeString = DateUtil.convertToHours(context.select);
        }

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

}
