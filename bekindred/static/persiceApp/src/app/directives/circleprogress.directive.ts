/// <reference path="../../typings/_custom.d.ts" />

import {Directive, ElementRef, NgStyle, Inject} from 'angular2/angular2';

declare var jQuery: any;

@Directive({
  selector: '[circle-progress]',
  properties: ['value: circle-progress', 'size', 'thickness']
})
export class CircleProgressDirective {
  el: ElementRef;
  value: any;
  size: number;
  thickness: number;

  constructor( @Inject(ElementRef) el: ElementRef) {
    this.el = el;
  }

  afterViewInit() {
    jQuery(this.el.nativeElement).circleProgress({
      value: this.value / 100,
      size: this.size,
      thickness: this.thickness,
      fill: {
        color: '#39c9f5'
      }
    });
  }

}
