/// <reference path="../../typings/_custom.d.ts" />

import { Directive, ElementRef, Attribute, NgStyle, Inject} from 'angular2/angular2';

declare var jQuery: any;

@Directive({
  selector: '[circle-progress]',
  properties: ['value: circle-progress']
})
export class CircleProgressDirective {
  el: ElementRef;
  value: any;

  constructor(@Inject(ElementRef) el: ElementRef) {
    this.el = el;
  }

  onInit() {
    // ToDo add real value for circle progress
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
