/// <reference path="../../typings/_custom.d.ts" />

import { Directive, ElementRef, Attribute, NgStyle} from 'angular2/angular2';

declare var jQuery: any;

@Directive({
  selector: '[circle-progress]',
  properties: ['value: circle-progress']
})
export class CircleProgressDirective {
  el: ElementRef;
  value: any;

  constructor(el: ElementRef) {
    this.el = el;
  }

  onInit() {
    // ToDo add real value for circle progress
    console.log(this.value);
    jQuery(this.el.nativeElement).circleProgress({
      value: 0.75,
      size: 128,
      thickness: 2,
      fill: {
        color: '#6dcbe8'
      }
    });
  }



}
