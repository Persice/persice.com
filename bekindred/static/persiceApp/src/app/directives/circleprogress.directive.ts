/// <reference path="../../typings/_custom.d.ts" />

import {Directive, ElementRef, NgStyle, Inject} from 'angular2/angular2';

declare var jQuery: any;

@Directive({
  selector: '[circle-progress]',
  properties: ['value: circle-progress']
})
export class CircleProgressDirective {
  el: ElementRef;
  value: any;

  constructor( @Inject(ElementRef) el: ElementRef) {
    this.el = el;
  }

  afterViewInit() {
    jQuery(this.el.nativeElement).circleProgress({
      value: this.value / 100,
      size: 128,
      thickness: 2,
      fill: {
        color: '#39c9f5'
      }
    });
  }

}