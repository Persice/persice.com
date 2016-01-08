import {Directive, ElementRef, Inject} from 'angular2/core';

declare var jQuery: any;

@Directive({
  selector: '[circle-progress]',
  properties: ['value: circle-progress', 'size', 'thickness', 'angle', 'reverse', 'color']
})
export class CircleProgressDirective {
  el: ElementRef;
  value: any;
  size: string;
  thickness: string;
  angle: string;
  reverse: string;
  color: string;

  constructor( @Inject(ElementRef) el: ElementRef) {
    this.el = el;
  }

  ngOnInit() {
    if (jQuery(this.el.nativeElement).data('circle-progress') === undefined) {
      jQuery(this.el.nativeElement).circleProgress({
        value: this.calculateValue(parseFloat(this.value)),
        size: parseInt(this.size, 10),
        thickness: parseInt(this.thickness, 10),
        startAngle: parseInt(this.angle, 10),
        fill: {
          color: this.color ? this.color : '#39c9f5'
        },
        reverse: this.reverse === 'true' ? true : false
      });
    }

  }

  ngOnChanges(changes) {

    if (jQuery(this.el.nativeElement).data('circle-progress') !== undefined) {
      jQuery(this.el.nativeElement).circleProgress({ 'value': this.calculateValue(changes.value.currentValue) });
    }
  }

  ngOnDestroy() {
    jQuery(this.el.nativeElement).off('circle-progress');
    jQuery(this.el.nativeElement).unbind('circle-progress');

  }

  calculateValue(value) {
    return parseInt(value, 10) / 100;
  }

}
