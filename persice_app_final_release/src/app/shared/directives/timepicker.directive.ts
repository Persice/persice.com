import { Directive, ElementRef, EventEmitter, AfterViewInit, Output } from '@angular/core';
import { DateUtil } from '../../../common/core';
import { Input } from '@angular/core/src/metadata/directives';

@Directive({
  selector: '[timepicker]',
})
export class TimepickerDirective implements AfterViewInit {
  el: ElementRef;
  @Output() selectedValue: EventEmitter<any> = new EventEmitter();
  @Input('timepicker') value: any;

  constructor(el: ElementRef) {
    this.el = el;
  }

  ngAfterViewInit() {

    jQuery(this.el.nativeElement).pickatime({
      onSet: (context) => {
        let timeString = '';

        if ('object' === typeof context.select) {
          timeString = DateUtil.convertToHours(context.select.pick);
        } else {
          timeString = DateUtil.convertToHours(context.select);
        }

        if (timeString !== 'NaN:NaN') {
          this.selectedValue.emit(timeString);
        } else {
          this.selectedValue.emit('Invalid time');
        }

      },
      onStart: () => {
        jQuery(this.el.nativeElement).pickatime('picker').set('select', parseInt(this.value, 10));
      },
      onOpen: () => {
        jQuery(this.el.nativeElement).pickatime('picker').set('view', parseInt(this.value, 10));
      }
    });

  }

}
