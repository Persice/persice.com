import { Directive, ElementRef, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { DateUtil } from '../../../common/core';
import { Input } from '@angular/core/src/metadata/directives';

@Directive({
  selector: '[datepicker]'
})
export class DatepickerDirective implements AfterViewInit {
  el: ElementRef;
  @Output() selectedValue: EventEmitter<any> = new EventEmitter();
  @Input('datepicker') value: any;

  constructor(el: ElementRef) {
    this.el = el;
  }

  ngAfterViewInit() {
    jQuery(this.el.nativeElement).pickadate({
      format: 'mm/dd/yyyy',
      formatSubmit: 'mm/dd/yyyy',
      onSet: (context) => {

        let dateString = '';

        if ('object' === typeof context.select) {
          dateString = DateUtil.convertFromUnixToDate(context.select.pick / 1000);
        } else {
          dateString = DateUtil.convertFromUnixToDate(context.select / 1000);
        }

        this.selectedValue.emit(dateString);
      },
      onStart: () => {
        jQuery(this.el.nativeElement).pickadate('picker').set('select', parseInt(this.value, 10));
      }
    });

  }

}
