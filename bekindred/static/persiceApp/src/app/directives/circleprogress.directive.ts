/// <reference path="../../typings/_custom.d.ts" />

import {Directive, ElementRef, Inject} from 'angular2/angular2';

declare var jQuery: any;

@Directive({
  selector: '[circle-progress]',
  properties: ['value: circle-progress', 'size', 'thickness', 'angle', 'reverse']
})
export class CircleProgressDirective {
  el: ElementRef;
  value: any;
  size: string;
  thickness: string;
  angle: string;
  reverse: string;

  constructor( @Inject(ElementRef) el: ElementRef) {
    this.el = el;
  }

  onInit() {
    if (jQuery(this.el.nativeElement).data('circle-progress') === undefined) {
      jQuery(this.el.nativeElement).circleProgress({
        value: this.calculateValue(parseFloat(this.value)),
        size: parseInt(this.size, 10),
        thickness: parseInt(this.thickness, 10),
        startAngle: parseInt(this.angle, 10),
        fill: {
          color: '#39c9f5'
        },
        reverse: this.reverse === 'true' ? true : false
      });
    }

  }

  onChanges(changes) {

    if (jQuery(this.el.nativeElement).data('circle-progress') !== undefined) {
      jQuery(this.el.nativeElement).circleProgress({ 'value': this.calculateValue(changes.value.currentValue) });
    }
  }

  onDestroy() {
    jQuery(this.el.nativeElement).off('circle-progress');
    jQuery(this.el.nativeElement).unbind('circle-progress');

  }

  calculateValue (value) {
    return parseInt(value, 10) / 100;
  }

}
