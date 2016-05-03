import {
  Directive,
  ElementRef,
  AfterViewInit,
  EventEmitter,
  Output
} from '@angular/core';
import {DateUtil} from '../core';

declare var jQuery: any;

@Directive({
  selector: '[datepicker]',
  properties: ['value: datepicker']
})
export class DatepickerDirective implements AfterViewInit {
  el: ElementRef;
  @Output() selectedValue: EventEmitter<any> = new EventEmitter();
  value: any;

  constructor(el: ElementRef) {
    this.el = el;
  }

  ngAfterViewInit() {

    let today = DateUtil.getTodayDate();

    jQuery(this.el.nativeElement).pickadate({
      format: 'mm/dd/yyyy',
      formatSubmit: 'mm/dd/yyyy',
      // min: new Date( today[0], today[1] - 1, today[2] ),
      onSet: (context) => {

        let dateString = '';

        if ('object' === typeof context.select) {
          dateString = DateUtil.convertFromUnixToDate(context.select.pick / 1000);
        } else {
          dateString = DateUtil.convertFromUnixToDate(context.select / 1000);
        }

        this.selectedValue.next(dateString);
      },
      onStart: () => {
        jQuery(this.el.nativeElement).pickadate('picker').set('select', parseInt(this.value, 10));
      }
    });

  }

}
